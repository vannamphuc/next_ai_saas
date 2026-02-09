import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EmojiReaction } from './EmojiReaction'
import { orpc } from '@/lib/orpc'
import { toast } from 'sonner'
import { GroupReaction } from '@/app/schemas/message'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import { InfiniteThreadMessages } from '@/lib/type'
import { useChannelRealtime } from '@/providers/ChannelRealtimeProvider'
import { useOptionalThreadRealtime } from '@/providers/ThreadRealtimeProvider'

type ThreadContext = { type: 'thread'; threadId: string }
type ListContext = { type: 'list'; channelId: string }

interface ReactionsBarProps {
  messageId: string
  reactions: GroupReaction[]
  context?: ThreadContext | ListContext
}

export const ReactionsBar = ({
  messageId,
  reactions,
  context,
}: ReactionsBarProps) => {
  const { channelId } = useParams<{ channelId: string }>()
  const queryClient = useQueryClient()
  const { updateReaction } = useChannelRealtime()
  const threadRealtime = useOptionalThreadRealtime()

  const toggleMutation = useMutation(
    orpc.message.reaction.toggle.mutationOptions({
      onMutate: async () => {
        const isThread = context && context.type === 'thread'

        if (isThread) {
          const listOptions = orpc.message.thread.list.queryOptions({
            input: {
              messageId: context.threadId,
            },
          })
          await queryClient.cancelQueries({ queryKey: listOptions.queryKey })
          const previousThread = queryClient.getQueryData(listOptions.queryKey)

          return {
            previousThread,
            threadQueryKey: listOptions.queryKey,
          }
        }

        const listKey = ['messages.list', channelId]
        await queryClient.cancelQueries({ queryKey: listKey })
        const previousMessages = queryClient.getQueryData(listKey)

        return {
          listKey,
          previousMessages,
        }
      },
      onSuccess: (data) => {
        // Update local cache with server response
        const isThread = context && context.type === 'thread'

        if (isThread) {
          const listOptions = orpc.message.thread.list.queryOptions({
            input: {
              messageId: context.threadId,
            },
          })

          queryClient.setQueryData(listOptions.queryKey, (old) => {
            if (!old) return old

            if (data.messageId === context.threadId) {
              return {
                ...old,
                parent: {
                  ...old.parent,
                  reactions: data.reactions,
                },
              }
            }

            return {
              ...old,
              messages: old.messages.map((m) => {
                if (m.id !== data.messageId) return m
                return {
                  ...m,
                  reactions: data.reactions,
                }
              }),
            }
          })

          // Broadcast to other clients via socket
          if (threadRealtime) {
            threadRealtime.updateThreadReaction(data.messageId, data.reactions)
          }
        } else {
          const listKey = ['messages.list', channelId]

          queryClient.setQueryData<InfiniteThreadMessages>(listKey, (old) => {
            if (!old) return old
            const pages = old.pages.map((page) => ({
              ...page,
              items: page.items.map((m) => {
                if (m.id !== data.messageId) return m
                return {
                  ...m,
                  reactions: data.reactions,
                }
              }),
            }))
            return { ...old, pages }
          })

          // Broadcast to other clients via socket
          updateReaction(data.messageId, data.reactions)
        }
      },
      onError: (_err, _vars, ctx) => {
        if (!ctx) return
        if (ctx.threadQueryKey && ctx.previousThread) {
          queryClient.setQueryData(ctx.threadQueryKey, ctx.previousThread)
        }
        if (ctx.listKey && ctx.previousMessages) {
          queryClient.setQueryData(ctx.listKey, ctx.previousMessages)
        }
        return toast.error('Failed to toggle reaction')
      },
    }),
  )

  const handleToggle = (emoji: string) => {
    toggleMutation.mutate({
      messageId,
      emoji,
    })
  }

  return (
    <div className="mt-1 flex items-center gap-1">
      {reactions?.map((reaction) => (
        <Button
          key={reaction.emoji}
          type="button"
          variant="secondary"
          size="sm"
          className={cn(
            'h-6 px-2 text-xs',
            reaction.reactedByMe && 'bg-primary/10 border-primary/20 border',
          )}
          onClick={() => handleToggle(reaction.emoji)}
        >
          <span>{reaction.emoji}</span>
          <span>{reaction.count}</span>
        </Button>
      ))}
      <EmojiReaction onSelect={handleToggle} />
    </div>
  )
}
