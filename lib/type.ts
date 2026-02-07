import { InfiniteData } from '@tanstack/react-query'
import { Mesage } from './generated/prisma/client'
import { GroupReaction } from '@/app/schemas/message'

export type MessageListItem = Mesage & {
  repliesCount: number
  reactions: GroupReaction[]
}
export type MessagePage = { items: Mesage[]; nextCursor?: string }
export type InfiniteMessages = InfiniteData<MessagePage>

export type ThreadPage = { items: MessageListItem[]; nextCursor?: string }
export type InfiniteThreadMessages = InfiniteData<ThreadPage>
