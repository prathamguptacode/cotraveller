import { z } from 'zod'

export const SignupSchema = z.object({
    email: z.email().nonoptional(),
    password: z.string().min(8).nonoptional(),
    fullName: z.string().min(1).max(35).nonoptional(),
})