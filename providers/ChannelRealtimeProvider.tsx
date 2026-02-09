import { GroupReaction } from '@/app/schemas/message'
import {
  channelEventSchema,
  RealtimeMessageSchema,
} from '@/app/schemas/realtime'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import usePartySocket from 'partysocket/react'
import { createContext, useContext, useMemo } from 'react'

interface ChannelRealtimeProviderProps {
  children: React.ReactNode
  channelId: string
}

type ChannelRealtimeContextType = {
  sendMessage: (message: RealtimeMessageSchema) => void
  updateMessage: (message: RealtimeMessageSchema) => void
  updateReaction: (messageId: string, reaction: GroupReaction[]) => void
  incrementReplyCount: (messageId: string, count: number) => void
}

type MessageListPage = { items: RealtimeMessageSchema[]; nextCursor?: string }
type MessageListInfiniteData = InfiniteData<MessageListPage>

const ChannelRealtimeContext = createContext<ChannelRealtimeContextType | null>(
  null,
)

export const ChannelRealtimeProvider = ({
  children,
  channelId,
}: ChannelRealtimeProviderProps) => {
  const queryClient = useQueryClient()

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST,
    room: `channel-${channelId}`,
    party: 'chat',

    onOpen: (event) => {
      console.log('🚀 ~ ChannelRealtimeProvider ~ e:', event)
    },

    onMessage(event) {
      try {
        const parsed = JSON.parse(event.data)
        const result = channelEventSchema.safeParse(parsed)
        if (!result.success) {
          return
        }
        const { type, payload } = result.data
        switch (type) {
          case 'message:created':
            const raw = payload.message
            // Insert at top of first page of infinite list for the channel
            queryClient.setQueryData(
              ['messages.list', channelId],
              (oldData: MessageListInfiniteData) => {
                if (!oldData) return oldData
                const firstPage = oldData.pages[0]
                if (!firstPage) return oldData
                const updatedFirst: MessageListPage = {
                  ...firstPage,
                  items: [raw, ...firstPage.items],
                }
                return {
                  ...oldData,
                  pages: [updatedFirst, ...oldData.pages.slice(1)],
                }
              },
            )
            break
          case 'message:updated':
            const updatedMessage = payload.message
            queryClient.setQueryData<MessageListInfiniteData>(
              ['messages.list', channelId],
              (oldData) => {
                if (!oldData) return oldData
                const updatedPages = oldData.pages.map((page) => {
                  return {
                    ...page,
                    items: page.items.map((item) => {
                      if (item.id === updatedMessage.id) {
                        return updatedMessage
                      }
                      return item
                    }),
                  }
                })
                return { ...oldData, pages: updatedPages }
              },
            )
            break
          case 'reaction:updated':
            const { messageId, reactions } = payload
            queryClient.setQueryData<MessageListInfiniteData>(
              ['messages.list', channelId],
              (oldData) => {
                if (!oldData) return oldData
                const updatedPages = oldData.pages.map((page) => ({
                  ...page,
                  items: page.items.map((item) => {
                    if (item.id === messageId) {
                      return {
                        ...item,
                        reactions,
                      }
                    }
                    return item
                  }),
                }))
                return { ...oldData, pages: updatedPages }
              },
            )
            break
          case 'message:replies:increment':
            const { messageId: threadMessageId, count } = payload
            queryClient.setQueryData<MessageListInfiniteData>(
              ['messages.list', channelId],
              (oldData) => {
                if (!oldData) return oldData
                const updatedPages = oldData.pages.map((page) => ({
                  ...page,
                  items: page.items.map((item) => {
                    if (item.id === threadMessageId) {
                      return {
                        ...item,
                        repliesCount: (item.repliesCount ?? 0) + count,
                      }
                    }
                    return item
                  }),
                }))
                return { ...oldData, pages: updatedPages }
              },
            )
            break
        }
      } catch (error) {
        console.log('🚀 ~ ChannelRealtimeProvider ~ error:', error)
      }
    },
  })

  const value = useMemo<ChannelRealtimeContextType>(() => {
    return {
      sendMessage: (message: RealtimeMessageSchema) => {
        socket.send(
          JSON.stringify({
            type: 'message:created',
            payload: { message },
          }),
        )
      },
      updateMessage: (message: RealtimeMessageSchema) => {
        socket.send(
          JSON.stringify({
            type: 'message:updated',
            payload: { message },
          }),
        )
      },
      updateReaction: (messageId: string, reactions: GroupReaction[]) => {
        socket.send(
          JSON.stringify({
            type: 'reaction:updated',
            payload: { messageId, reactions },
          }),
        )
      },
      incrementReplyCount: (messageId: string, count: number) => {
        socket.send(
          JSON.stringify({
            type: 'message:replies:increment',
            payload: { messageId, count },
          }),
        )
      },
    }
  }, [socket])

  return (
    <ChannelRealtimeContext.Provider value={value}>
      {children}
    </ChannelRealtimeContext.Provider>
  )
}

export const useChannelRealtime = (): ChannelRealtimeContextType => {
  const context = useContext(ChannelRealtimeContext)
  if (!context) {
    throw new Error(
      'useChannelRealtime must be used within ChannelRealtimeProvider',
    )
  }
  return context
}
