'use client'

import { CreateMessage, createMessageSchema } from '@/app/schemas/message'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { MessageComposer } from '../message/MessageComposer'
import { useAttachmentUpload } from '@/hooks/use-attachment-upload'
import { useEffect, useState } from 'react'
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { orpc } from '@/lib/orpc'
import { toast } from 'sonner'
import { Mesage } from '@/lib/generated/prisma/client'
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs'
import { getAvatar } from '@/lib/get-avatar'
import { InfiniteThreadMessages } from '@/lib/type'

interface ThreadReplyFormProps {
  threadId: string
  user: KindeUser<Record<string, unknown>>
}

export const ThreadReplyForm = ({ threadId, user }: ThreadReplyFormProps) => {
  const { channelId } = useParams<{ channelId: string }>()
  const upload = useAttachmentUpload()
  const [editorKey, setEditorKey] = useState(0)
  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      content: '',
      channelId: channelId,
      threadId: threadId,
    },
  })

  useEffect(() => {
    form.setValue('threadId', threadId)
  }, [threadId, form])

  const createMessageMutation = useMutation(
    orpc.message.create.mutationOptions({
      onMutate: async (data) => {
        const listOptions = orpc.message.thread.list.queryOptions({
          input: {
            messageId: threadId!,
          },
        })

        await queryClient.cancelQueries({ queryKey: listOptions.queryKey })
        const previousValue = queryClient.getQueryData(listOptions.queryKey)

        const optimistic: Mesage = {
          id: `optimistic:${crypto.randomUUID()}`,
          content: form.getValues('content'),
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: user.id!,
          authorEmail: user.email!,
          authorName: user.given_name ?? 'John Doe',
          authorAvatar: getAvatar(user.picture, user.email!),
          channelId: data.channelId,
          threadId: data.threadId!,
          imageUrl: data.imageUrl ?? null,
        }

        queryClient.setQueryData(listOptions.queryKey, (old) => {
          if (!old) return old
          return {
            ...old,
            messages: [...old.messages, optimistic],
          }
        })

        // Optimistically bump replies count in main message list for the parent
        queryClient.setQueryData<InfiniteThreadMessages>(
          ['messages.list', channelId],
          (old) => {
            if (!old) return old

            const pages = old.pages.map((p) => {
              return {
                ...p,
                items: p.items.map((m) => {
                  if (m.id === threadId) {
                    return {
                      ...m,
                      repliesCount: m.repliesCount + 1,
                    }
                  }
                  return m
                }),
              }
            })
            return { ...old, pages }
          },
        )

        return {
          listOptions,
          previousValue,
        }
      },

      onSuccess: (_data, _vars, ctx) => {
        queryClient.invalidateQueries({ queryKey: ctx.listOptions.queryKey })
        form.reset({
          content: '',
          channelId: channelId,
          threadId: threadId,
        })
        upload.clear()
        setEditorKey((prev) => prev + 1)
        return toast.success('Message sent successfully')
      },

      onError: (_err, _vars, ctx) => {
        if (!ctx) return
        const { listOptions, previousValue } = ctx

        if (previousValue) {
          queryClient.setQueryData(listOptions.queryKey, previousValue)
        }

        return toast.error('Failed to send message')
      },
    }),
  )

  const onSubmit = (data: CreateMessage) => {
    createMessageMutation.mutate({
      ...data,
      channelId: channelId,
      threadId: threadId,
      imageUrl: upload.stagedUrl ?? undefined,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MessageComposer
                  key={editorKey}
                  value={field.value}
                  onChange={field.onChange}
                  upload={upload}
                  onSubmit={() => onSubmit(form.getValues())}
                  isSubmitting={createMessageMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
