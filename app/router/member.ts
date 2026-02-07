import z from 'zod'
import { heavyWriteSecurityMiddleware } from '../middlewares/arcject/heavy-write'
import { standardSecurityMiddlewae } from '../middlewares/arcject/standard'
import { requiredAuthMiddleware } from '../middlewares/auth'
import { base } from '../middlewares/base'
import { requiredWorkspaceMiddleware } from '../middlewares/workspace'
import { inviteMemberSchema } from '../schemas/member'
import {
  init,
  organization_user,
  Organizations,
  Users,
} from '@kinde/management-api-js'
import { getAvatar } from '@/lib/get-avatar'
import { readSecurityMiddleware } from '../middlewares/arcject/read'

export const inviteMember = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddlewae)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: 'POST',
    path: '/workspace/members/invite',
    summary: 'Invite a member to workspace',
    tags: ['members'],
  })
  .input(inviteMemberSchema)
  .output(z.void())
  .handler(async ({ input, context, errors }) => {
    try {
      init()
      await Users.createUser({
        requestBody: {
          organization_code: context.workspace.orgCode,
          profile: {
            given_name: input.name,
            picture: getAvatar(null, input.email),
          },
          identities: [
            {
              type: 'email',
              details: {
                email: input.email,
              },
            },
          ],
        },
      })
    } catch {
      throw errors.USER_ALREADY_EXISTS()
    }
  })

export const listMember = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddlewae)
  // .use(readSecurityMiddleware)
  .route({
    method: 'GET',
    path: '/workspace/members',
    summary: 'Get workspace members',
    tags: ['members'],
  })
  .output(z.array(z.custom<organization_user>()))
  .handler(async ({ context, errors }) => {
    try {
      init()
      const members = await Organizations.getOrganizationUsers({
        orgCode: context.workspace.orgCode,
        sort: 'name_asc',
      })

      if (!members.organization_users) {
        throw errors.NOT_FOUND()
      }

      return members.organization_users
    } catch {
      throw errors.INTERNAL_SERVER_ERROR()
    }
  })
