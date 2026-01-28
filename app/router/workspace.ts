import { KindeOrganization, KindeUser } from '@kinde-oss/kinde-auth-nextjs'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import z from 'zod'
import { base } from '../middlewares/base'
import { requiredAuthMiddleware } from '../middlewares/auth'
import { requiredWorkspaceMiddleware } from '../middlewares/workspace'
import { workspaceSchema } from '../schemas/workspace'
import { init, Organizations } from '@kinde/management-api-js'
import { standardSecurityMiddlewae } from '../middlewares/arcject/standard'
import { heavyWriteSecurityMiddleware } from '../middlewares/arcject/heavy-write'

export const listWorkspace = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    method: 'GET',
    path: '/workspace',
    summary: 'List all workspaces',
    tags: ['workspace'],
  })
  .input(z.void())
  .output(
    z.object({
      workspaces: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          avatar: z.string(),
        }),
      ),
      user: z.custom<KindeUser<Record<string, unknown>>>(),
      currentWorkspace: z.custom<KindeOrganization<unknown>>(),
    }),
  )
  .handler(async ({ context, errors }) => {
    const { getUserOrganizations } = getKindeServerSession()
    const organizations = await getUserOrganizations()

    if (!organizations) {
      throw errors.INTERNAL_SERVER_ERROR()
    }

    return {
      workspaces: organizations?.orgs.map((org) => ({
        id: org.code,
        name: org.name ?? 'My Workspace',
        avatar: org.name?.charAt(0).toUpperCase() ?? 'M',
      })),
      user: context.user,
      currentWorkspace: context.workspace,
    }
  })

export const createWorkspace = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddlewae)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: 'POST',
    path: '/workspace',
    summary: 'Create a new workspaces',
    tags: ['workspace'],
  })
  .input(workspaceSchema)
  .output(
    z.object({
      orgCode: z.string(),
      workspaceName: z.string(),
    }),
  )
  .handler(async ({ input, context, errors }) => {
    init()
    let data

    // Create Organization
    try {
      data = await Organizations.createOrganization({
        requestBody: {
          name: input.name,
        },
      })
    } catch {
      throw errors.FORBIDDEN()
    }

    // Add User to Organization
    if (!data.organization?.code) {
      throw errors.FORBIDDEN({
        message: 'Org Code is not defined',
      })
    }
    try {
      await Organizations.addOrganizationUsers({
        orgCode: data.organization.code,
        requestBody: {
          users: [
            {
              id: context.user.id,
              roles: ['admin'],
            },
          ],
        },
      })
    } catch {
      throw errors.FORBIDDEN()
    }

    const { refreshTokens } = getKindeServerSession()
    await refreshTokens()

    return {
      orgCode: data.organization.code,
      workspaceName: input.name || '',
    }
  })
