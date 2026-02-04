import { InfiniteData } from '@tanstack/react-query'
import { Mesage } from './generated/prisma/client'

export type MessageListItem = Mesage & {
  repliesCount: number
}
export type MessagePage = { items: Mesage[]; nextCursor?: string }
export type InfiniteMessages = InfiniteData<MessagePage>

export type ThreadPage = { items: MessageListItem[]; nextCursor?: string }
export type InfiniteThreadMessages = InfiniteData<ThreadPage>
