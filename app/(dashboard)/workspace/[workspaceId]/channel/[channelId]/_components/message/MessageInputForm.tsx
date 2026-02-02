'use client'

import { CreateMessage, createMessageSchema } from '@/app/schemas/message'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { MessageComposer } from './MessageComposer'
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { orpc } from '@/lib/orpc'
import { toast } from 'sonner'
import { useState } from 'react'
import { useAttachmentUpload } from '@/hooks/use-attachment-upload'
import { Mesage } from '@/lib/generated/prisma/client'
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs'
import { getAvatar } from '@/lib/get-avatar'

interface IAppProps {
  channelId: string
  user: KindeUser<Record<string, unknown>>
}

type MessagePage = { items: Mesage[]; nextCursor?: string }
type InfiniteMessages = InfiniteData<MessagePage>

export const MessageInputForm = ({ channelId, user }: IAppProps) => {
  const queryClient = useQueryClient()
  const [editorKey, setEditorKey] = useState(0)
  const upload = useAttachmentUpload()

  const form = useForm({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      channelId: channelId,
      content: '',
    },
  })

  const createMessageMutation = useMutation(
    orpc.message.create.mutationOptions({
      onMutate: async (data) => {
        await queryClient.cancelQueries({
          queryKey: ['messages.list', channelId],
        })

        const previousData = queryClient.getQueryData<InfiniteMessages>([
          'messages.list',
          channelId,
        ])

        const tempId = `optimistic-${crypto.randomUUID()}`

        const optimisticMessage: Mesage = {
          id: tempId,
          content: data.content,
          imageUrl: data.imageUrl ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
          channelId: channelId,
          authorId: user.id,
          authorEmail: user.email!,
          authorName: user.given_name ?? 'John Doe',
          authorAvatar: getAvatar(user.picture, user.email!),
        }

        queryClient.setQueryData<InfiniteMessages>(
          ['messages.list', channelId],
          (oldData) => {
            if (!oldData) {
              return {
                pages: [
                  {
                    items: [optimisticMessage],
                    nextCursor: undefined,
                  },
                ],
                pageParams: [undefined],
              }
            }

            const firstPage = oldData.pages[0] ?? {
              items: [],
              nextCursor: undefined,
            }

            const updatedFirstPage = {
              ...firstPage,
              items: [optimisticMessage, ...firstPage.items],
            }

            return {
              ...oldData,
              pages: [updatedFirstPage, ...oldData.pages.slice(1)],
            }
          },
        )

        return {
          optimisticMessage,
          previousData,
        }
      },

      onSuccess: (data, _variables, context) => {
        queryClient.setQueryData<InfiniteMessages>(
          ['messages.list', channelId],
          (old) => {
            if (!old) return old

            const updatedPages = old.pages.map((page) => {
              return {
                ...page,
                items: page.items.map((item) => {
                  if (item.id === context?.optimisticMessage.id) {
                    return data
                  }
                  return item
                }),
              }
            })

            return {
              ...old,
              pages: updatedPages,
            }
          },
        )
        form.reset({
          channelId,
          content: '',
        })
        upload.clear()
        setEditorKey((prev) => prev + 1)
        return toast.success('Message created successfully')
      },

      onError: (error, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData<InfiniteMessages>(
            ['messages.list', channelId],
            context.previousData,
          )
        }
        return toast.error('Something went wrong')
      },
    }),
  )

  const onSubmit = (data: CreateMessage) => {
    createMessageMutation.mutate({
      ...data,
      imageUrl: upload.stagedUrl ?? undefined,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <MessageComposer
                    key={editorKey}
                    upload={upload}
                    value={field.value}
                    onChange={field.onChange}
                    onSubmit={() => onSubmit(form.getValues())}
                    isSubmitting={createMessageMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </form>
    </Form>
  )
}
