import { GroupReaction } from '@/app/schemas/message'
import {
  RealtimeMessageSchema,
  threadEventSchema,
} from '@/app/schemas/realtime'
import { orpc } from '@/lib/orpc'
import { MessageListItem } from '@/lib/type'
import { useQueryClient } from '@tanstack/react-query'
import usePartySocket from 'partysocket/react'
import { createContext, useContext, useMemo } from 'react'

interface ThreadRealtimeProviderProps {
  children: React.ReactNode
  threadId: string
}

type ThreadRealtimeContextType = {
  sendReply: (reply: RealtimeMessageSchema) => void
  updateThreadReaction: (messageId: string, reactions: GroupReaction[]) => void
}

const ThreadRealtimeContext = createContext<ThreadRealtimeContextType | null>(
  null,
)

export const ThreadRealtimeProvider = ({
  children,
  threadId,
}: ThreadRealtimeProviderProps) => {
  const queryClient = useQueryClient()

  // Lấy queryKey của thread list để update cache
  const threadListOptions = orpc.message.thread.list.queryOptions({
    input: { messageId: threadId },
  })

  const socket = usePartySocket({
    host: 'http://127.0.0.1:8787',
    room: `thread-${threadId}`, // Mỗi thread là một room riêng cho performance
    party: 'chat',

    onMessage(event) {
      try {
        const parsed = JSON.parse(event.data)
        const result = threadEventSchema.safeParse(parsed)
        if (!result.success) return

        const { type, payload } = result.data

        switch (type) {
          case 'thread:reply:created':
            const { reply } = payload
            queryClient.setQueryData(
              threadListOptions.queryKey,
              (
                old:
                  | { parent: MessageListItem; messages: MessageListItem[] }
                  | undefined,
              ) => {
                if (!old) return old
                // Tránh duplicate nếu chính mình là người gửi (vì đã có optimistic update)
                if (old.messages.some((m) => m.id === reply.id)) return old

                return {
                  ...old,
                  messages: [...old.messages, reply as MessageListItem],
                }
              },
            )
            break

          case 'thread:reaction:updated':
            const { messageId, reactions } = payload
            queryClient.setQueryData(
              threadListOptions.queryKey,
              (
                old:
                  | { parent: MessageListItem; messages: MessageListItem[] }
                  | undefined,
              ) => {
                if (!old) return old

                // 1. Update parent nếu messageId trùng với threadId
                if (old.parent.id === messageId) {
                  return {
                    ...old,
                    parent: { ...old.parent, reactions },
                  }
                }

                // 2. Update list replies
                const updatedMessages = old.messages.map((m) => {
                  if (m.id === messageId) {
                    return { ...m, reactions }
                  }
                  return m
                })

                return {
                  ...old,
                  messages: updatedMessages,
                }
              },
            )
            break
        }
      } catch (error) {
        console.error('🚀 ~ ThreadRealtimeProvider ~ error:', error)
      }
    },
  })

  const value = useMemo<ThreadRealtimeContextType>(() => {
    return {
      sendReply: (reply: RealtimeMessageSchema) => {
        socket.send(
          JSON.stringify({
            type: 'thread:reply:created',
            payload: { reply },
          }),
        )
      },
      updateThreadReaction: (messageId: string, reactions: GroupReaction[]) => {
        socket.send(
          JSON.stringify({
            type: 'thread:reaction:updated',
            payload: { messageId, reactions, threadId },
          }),
        )
      },
    }
  }, [socket, threadId])

  return (
    <ThreadRealtimeContext.Provider value={value}>
      {children}
    </ThreadRealtimeContext.Provider>
  )
}

export const useThreadRealtime = (): ThreadRealtimeContextType => {
  const context = useContext(ThreadRealtimeContext)
  if (!context) {
    throw new Error(
      'useThreadRealtime must be used within ThreadRealtimeProvider',
    )
  }
  return context
}

export const useOptionalThreadRealtime = () => useContext(ThreadRealtimeContext)
