import z from 'zod'
import { standardSecurityMiddlewae } from '../middlewares/arcject/standard'
import { writeSecurityMiddleware } from '../middlewares/arcject/write'
import { requiredAuthMiddleware } from '../middlewares/auth'
import { base } from '../middlewares/base'
import { requiredWorkspaceMiddleware } from '../middlewares/workspace'
import prisma from '@/lib/prisma'
import { createMessageSchema, updateMessageSchema } from '../schemas/message'
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
      },
    })

    const items: MessageListItem[] = messages.map((message) => ({
      ...message,
      repliesCount: message._count.replies,
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
      parent: z.custom<Mesage>(),
      messages: z.array(z.custom<Mesage>()),
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
    })

    if (!message) {
      throw errors.NOT_FOUND()
    }

    const replies = await prisma.mesage.findMany({
      where: {
        threadId: input.messageId,
      },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    })

    const parent = {
      ...message,
    }

    const messages = replies.map((reply) => {
      return {
        ...reply,
      }
    })

    return {
      parent,
      messages,
    }
  })
