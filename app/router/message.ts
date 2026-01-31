import z from 'zod'
import { standardSecurityMiddlewae } from '../middlewares/arcject/standard'
import { writeSecurityMiddleware } from '../middlewares/arcject/write'
import { requiredAuthMiddleware } from '../middlewares/auth'
import { base } from '../middlewares/base'
import { requiredWorkspaceMiddleware } from '../middlewares/workspace'
import prisma from '@/lib/prisma'
import { createMessageSchema } from '../schemas/message'
import { getAvatar } from '@/lib/get-avatar'
import { Mesage } from '@/lib/generated/prisma/client'
import { readSecurityMiddleware } from '../middlewares/arcject/read'

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

    const created = await prisma.mesage.create({
      data: {
        content: input.content,
        imageUrl: input.imageUrl,
        channelId: input.channelId,
        authorEmail: context.user.email!,
        authorName: context.user.given_name ?? 'Private',
        authorAvatar: getAvatar(context.user.picture, context.user.email!),
        authorId: context.user.id,
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
    }),
  )
  .output(z.array(z.custom<Mesage>()))
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

    const data = await prisma.mesage.findMany({
      where: {
        channelId: input.channelId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data
  })
