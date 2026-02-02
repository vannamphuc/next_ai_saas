import z from 'zod'

export const inviteMemberSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.email(),
})

export type InviteMemberSchema = z.infer<typeof inviteMemberSchema>
