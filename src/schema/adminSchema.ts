import {email, z} from "zod"

export const signupSchema = z.object({
    email: z.email(),
    secretKey: z.string(),
    name: z.string()
})

export const signinSchema = z.object({
    email: z.email(),
    secretKey: z.string()
})