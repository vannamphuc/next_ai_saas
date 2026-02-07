import z from 'zod'

export const createMessageSchema = z.object({
  channelId: z.string(),
  content: z.string(),
  imageUrl: z.url().optional(),
  threadId: z.string().optional(),
})

export const updateMessageSchema = z.object({
  messageId: z.string(),
  content: z.string(),
})

export const messageReactionSchema = z.object({
  messageId: z.string(),
  emoji: z.string().min(1),
})

export const groupReactionSchema = z.object({
  emoji: z.string(),
  count: z.number(),
  reactedByMe: z.boolean(),
})

export type UpdateMessage = z.infer<typeof updateMessageSchema>
export type CreateMessage = z.infer<typeof createMessageSchema>
export type MessageReaction = z.infer<typeof messageReactionSchema>
export type GroupReaction = z.infer<typeof groupReactionSchema>
