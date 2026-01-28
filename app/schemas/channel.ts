import z from 'zod'

export const transformChannelName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/[^a-z0-9-]/g, '') // Remove invalid characters
    .replace(/-+/g, '-') // Replace multiple dashes with a single dash
    .replace(/^-+|-$/g, '') // Trim dashes from start and end
}

export const channelSchema = z.object({
  name: z
    .string()
    .min(2, 'Channel name must be at least 2 characters long')
    .max(50, 'Channel name must be less than 50 characters long')
    .transform((name, ctx) => {
      const transformedName = transformChannelName(name)
      if (transformedName.length < 2) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Channel name must contain at least 2 alphanumeric characters',
        })
        return z.NEVER
      }
      return transformedName
    }),
})

export type ChannelSchema = z.infer<typeof channelSchema>
