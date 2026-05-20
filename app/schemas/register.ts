import { z } from 'zod'

export const registerSchema = z
  .object({
    username: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    repeatPassword: z.string().min(1),
    inviteToken: z.string().min(1),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  })

export type RegisterSchema = z.infer<typeof registerSchema>
