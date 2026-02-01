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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc'
import { toast } from 'sonner'
import { useState } from 'react'
import { useAttachmentUpload } from '@/hooks/use-attachment-upload'

interface IAppProps {
  channelId: string
}

export const MessageInputForm = ({ channelId }: IAppProps) => {
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
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.message.list.key(),
        })
        form.reset({
          channelId,
          content: '',
        })
        upload.clear()
        setEditorKey((k) => k + 1)
        return toast.success('Message created successfully')
      },

      onError: () => {
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
