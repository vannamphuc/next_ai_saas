import z from 'zod'

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
