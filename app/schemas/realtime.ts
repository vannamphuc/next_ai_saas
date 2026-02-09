import z from 'zod'
import { groupReactionSchema } from './message'

export const userSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  email: z.email().nullable(),
  picture: z.string().nullable(),
})

export type UserSchema = z.infer<typeof userSchema>

export const presenceSchema = z.union([
  z.object({
    type: z.literal('add-user'),
    payload: userSchema,
  }),
  z.object({
    type: z.literal('remove-user'),
    payload: z.object({
      id: z.string(),
    }),
  }),
  z.object({
    type: z.literal('presence'),
    payload: z.object({
      users: z.array(userSchema),
    }),
  }),
])

export type PresenceSchema = z.infer<typeof presenceSchema>

export const realtimeMessageSchema = z.object({
  id: z.string(),
  content: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  authorId: z.string(),
  authorName: z.string(),
  authorEmail: z.string(),
  authorAvatar: z.string().nullable().optional(),
  channelId: z.string().nullable(),
  threadId: z.string().nullable(),
  reactions: z.array(groupReactionSchema).optional(),
  repliesCount: z.number().optional(),
})

export type RealtimeMessageSchema = z.infer<typeof realtimeMessageSchema>

// Channel
export const channelEventSchema = z.union([
  z.object({
    type: z.literal('message:created'),
    payload: z.object({ message: realtimeMessageSchema }),
  }),
  z.object({
    type: z.literal('message:updated'),
    payload: z.object({ message: realtimeMessageSchema }),
  }),
  z.object({
    type: z.literal('reaction:updated'),
    payload: z.object({
      messageId: z.string(),
      reactions: z.array(groupReactionSchema),
    }),
  }),
  z.object({
    type: z.literal('message:replies:increment'),
    payload: z.object({ messageId: z.string(), count: z.number() }),
  }),
])

export type ChannelEventSchema = z.infer<typeof channelEventSchema>

export const threadEventSchema = z.union([
  z.object({
    type: z.literal('thread:reply:created'),
    payload: z.object({ reply: realtimeMessageSchema }),
  }),
  z.object({
    type: z.literal('thread:reaction:updated'),
    payload: z.object({
      messageId: z.string(),
      reactions: z.array(groupReactionSchema),
      threadId: z.string(),
    }),
  }),
])

export type ThreadEventSchema = z.infer<typeof threadEventSchema>
