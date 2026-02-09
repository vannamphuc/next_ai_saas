'use client'

import { UpdateMessage, updateMessageSchema } from '@/app/schemas/message'
import { RichTextEditor } from '@/components/rich-text-edior/Editor'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Mesage } from '@/lib/generated/prisma/client'
import { orpc } from '@/lib/orpc'
import { InfiniteMessages } from '@/lib/type'
import { useChannelRealtime } from '@/providers/ChannelRealtimeProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditMessageProps {
  message: Mesage
  onCancel: () => void
  onSave: () => void
}

export const EditMessage = ({
  message,
  onCancel,
  onSave,
}: EditMessageProps) => {
  const queryClient = useQueryClient()
  const { updateMessage } = useChannelRealtime()
  const form = useForm({
    resolver: zodResolver(updateMessageSchema),
    defaultValues: {
      content: message.content,
      messageId: message.id,
    },
  })

  const updateMutation = useMutation(
    orpc.message.update.mutationOptions({
      onSuccess: (data) => {
        queryClient.setQueryData<InfiniteMessages>(
          ['messages.list', message.channelId],
          (oldData) => {
            if (!oldData) return oldData

            const updatedMessage = data.message

            const pages = oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === updatedMessage.id ? updatedMessage : item,
              ),
            }))

            return {
              ...oldData,
              pages,
            }
          },
        )
        updateMessage(data.message)
        toast.success('Message updated successfully')
        onSave()
      },

      onError: (e) => {
        toast.error(e.message)
      },
    }),
  )

  const onSubmit = (data: UpdateMessage) => {
    updateMutation.mutate(data)
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
                <RichTextEditor
                  field={field}
                  sendButton={
                    <div className="flex gap-4 items-center">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={updateMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        type="submit"
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  }
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
