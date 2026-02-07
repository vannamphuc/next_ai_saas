import z from 'zod'
import { standardSecurityMiddlewae } from '../middlewares/arcject/standard'
import { writeSecurityMiddleware } from '../middlewares/arcject/write'
import { requiredAuthMiddleware } from '../middlewares/auth'
import { base } from '../middlewares/base'
import { requiredWorkspaceMiddleware } from '../middlewares/workspace'
import prisma from '@/lib/prisma'
import {
  createMessageSchema,
  GroupReaction,
  groupReactionSchema,
  messageReactionSchema,
  updateMessageSchema,
} from '../schemas/message'
import { getAvatar } from '@/lib/get-avatar'
import { Mesage } from '@/lib/generated/prisma/client'
import { readSecurityMiddleware } from '../middlewares/arcject/read'
import { MessageListItem } from '@/lib/type'

export const createMessage = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddlewae)
  .use(writeSecurityMiddleware)
  .route({
    method: 'POST',
    path: '/messages',
    summary: 'Create a message',
    tags: ['messages'],
  })
  .input(createMessageSchema)
  .output(z.custom<Mesage>())
  .handler(async ({ input, context, errors }) => {
    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
    })

    if (!channel) {
      throw errors.FORBIDDEN()
    }

    // If this is thread reply, validate the parent message
    if (input.threadId) {
      const parentMessage = await prisma.mesage.findFirst({
        where: {
          id: input.threadId,
          Channel: {
            workspaceId: context.workspace.orgCode,
          },
        },
      })

      if (
        !parentMessage ||
        parentMessage.channelId !== input.channelId ||
        parentMessage.threadId !== null
      ) {
        throw errors.BAD_REQUEST()
      }
    }

    const created = await prisma.mesage.create({
      data: {
        content: input.content,
        imageUrl: input.imageUrl,
        channelId: input.channelId,
        authorEmail: context.user.email!,
        authorName: context.user.given_name ?? 'Private',
        authorAvatar: getAvatar(context.user.picture, context.user.email!),
        authorId: context.user.id,
        threadId: input.threadId,
      },
    })

    return {
      ...created,
    }
  })

export const listMessages = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddlewae)
  .use(readSecurityMiddleware)
  .route({
    method: 'GET',
    path: '/messages',
    summary: 'List all messages',
    tags: ['messages'],
  })
  .input(
    z.object({
      channelId: z.string(),
      limit: z.number().min(1).max(100).optional(),
      cursor: z.string().optional(),
    }),
  )
  .output(
    z.object({
      items: z.array(z.custom<MessageListItem>()),
      nextCursor: z.string().optional(),
    }),
  )
  .handler(async ({ input, context, errors }) => {
    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
    })

    if (!channel) {
      throw errors.FORBIDDEN()
    }

    const limit = input.limit ?? 30
    const messages = await prisma.mesage.findMany({
      where: {
        channelId: input.channelId,
        threadId: null,
      },
      ...(input.cursor
        ? {
            cursor: {
              id: input.cursor,
            },
            skip: 1,
          }
        : {}),
      take: limit,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        _count: {
          select: {
            replies: true,
          },
        },
        messageReactions: {
          select: {
            emoji: true,
            userId: true,
          },
        },
      },
    })

    const items: MessageListItem[] = messages.map((message) => ({
      ...message,
      repliesCount: message._count.replies,
      reactions: groupReaction(
        message.messageReactions.map((reaction) => ({
          emoji: reaction.emoji,
          userId: reaction.userId,
        })),
        context.user.id,
      ),
    }))

    const nextCursor =
      messages.length === limit ? messages[messages.length - 1].id : undefined

    return {
      items: items,
      nextCursor: nextCursor,
    }
  })

export const updateMessage = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddlewae)
  .use(writeSecurityMiddleware)
  .route({
    method: 'PUT',
    path: '/messages/:messageId',
    summary: 'Update a message',
    tags: ['messages'],
  })
  .input(updateMessageSchema)
  .output(
    z.object({
      message: z.custom<Mesage>(),
      canEdit: z.boolean(),
    }),
  )
  .handler(async ({ input, context, errors }) => {
    const message = await prisma.mesage.findFirst({
      where: {
        id: input.messageId,
        Channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
        authorId: true,
      },
    })

    if (!message) {
      throw errors.NOT_FOUND()
    }

    if (message.authorId !== context.user.id) {
      throw errors.FORBIDDEN()
    }

    const updated = await prisma.mesage.update({
      where: {
        id: input.messageId,
      },
      data: {
        content: input.content,
      },
    })

    return {
      message: updated,
      canEdit: updated.authorId === context.user.id,
    }
  })

export const listThreadMessages = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddlewae)
  .use(readSecurityMiddleware)
  .route({
    method: 'GET',
    path: '/messages/:messageId/thread',
    summary: 'List all thread replies',
    tags: ['messages'],
  })
  .input(
    z.object({
      messageId: z.string(),
    }),
  )
  .output(
    z.object({
      parent: z.custom<MessageListItem>(),
      messages: z.array(z.custom<MessageListItem>()),
    }),
  )
  .handler(async ({ input, context, errors }) => {
    const message = await prisma.mesage.findFirst({
      where: {
        id: input.messageId,
        Channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      include: {
        _count: {
          select: {
            replies: true,
          },
        },
        messageReactions: {
          select: {
            emoji: true,
            userId: true,
          },
        },
      },
    })

    if (!message) {
      throw errors.NOT_FOUND()
    }

    const replies = await prisma.mesage.findMany({
      where: {
        threadId: input.messageId,
      },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      include: {
        _count: {
          select: {
            replies: true,
          },
        },
        messageReactions: {
          select: {
            emoji: true,
            userId: true,
          },
        },
      },
    })

    const parent: MessageListItem = {
      ...message,
      reactions: groupReaction(
        message.messageReactions.map((reaction) => ({
          emoji: reaction.emoji,
          userId: reaction.userId,
        })),
        context.user.id,
      ),
      repliesCount: message._count.replies,
    }

    const messages = replies.map((reply) => {
      return {
        ...reply,
        reactions: groupReaction(
          reply.messageReactions.map((reaction) => ({
            emoji: reaction.emoji,
            userId: reaction.userId,
          })),
          context.user.id,
        ),
        repliesCount: reply._count.replies,
      }
    })

    return {
      parent,
      messages,
    }
  })

const groupReaction = (
  reactions: { emoji: string; userId: string }[],
  userId: string,
): GroupReaction[] => {
  const reactionMap = new Map<string, { count: number; reactedByMe: boolean }>()

  for (const reaction of reactions) {
    const existing = reactionMap.get(reaction.emoji)
    if (existing) {
      existing.count++
      if (reaction.userId === userId) {
        existing.reactedByMe = true
      }
    } else {
      reactionMap.set(reaction.emoji, {
        count: 1,
        reactedByMe: reaction.userId === userId,
      })
    }
  }

  return Array.from(reactionMap.entries()).map(
    ([emoji, { count, reactedByMe }]) => ({
      emoji,
      count,
      reactedByMe,
    }),
  )
}

export const toggleReaction = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddlewae)
  .use(writeSecurityMiddleware)
  .route({
    method: 'POST',
    path: '/messages/:messageId/reactions',
    summary: 'Toggle reaction',
    tags: ['messages'],
  })
  .input(messageReactionSchema)
  .output(
    z.object({
      messageId: z.string(),
      reactions: z.array(groupReactionSchema),
    }),
  )
  .handler(async ({ input, context, errors }) => {
    const message = await prisma.mesage.findFirst({
      where: {
        id: input.messageId,
        Channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
      },
    })

    if (!message) {
      throw errors.NOT_FOUND()
    }

    const inserted = await prisma.messageReaction.createMany({
      data: [
        {
          emoji: input.emoji,
          mesageId: input.messageId,
          userId: context.user.id,
          userEmail: context.user.email!,
          userName: context.user.given_name ?? 'Private',
          userAvatar: getAvatar(context.user.picture, context.user.email!),
        },
      ],
      skipDuplicates: true,
    })

    if (inserted.count === 0) {
      await prisma.messageReaction.deleteMany({
        where: {
          mesageId: input.messageId,
          emoji: input.emoji,
          userId: context.user.id,
        },
      })
    }

    const updated = await prisma.mesage.findUnique({
      where: {
        id: input.messageId,
      },
      include: {
        messageReactions: {
          select: {
            emoji: true,
            userId: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    })

    if (!updated) {
      throw errors.NOT_FOUND()
    }

    return {
      messageId: updated.id,
      reactions: groupReaction(
        (updated.messageReactions ?? []).map((r) => ({
          emoji: r.emoji,
          userId: r.userId,
        })),
        context.user.id,
      ),
    }
  })
