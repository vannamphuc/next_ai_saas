import { z } from 'zod'

export const workspaceSchema = z.object({
  name: z.string().min(3).max(50),
})

export type WorkspaceSchema = z.infer<typeof workspaceSchema>
