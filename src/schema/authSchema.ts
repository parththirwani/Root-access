import {z} from "zod"

export const signupSchema = z.object({
    email: z.email(),
    secretKey: z.string(),
    name: z.string().min(1,"Name should be atleast 1 char")
})

export const signinSchema = z.object({
    email: z.email(),
    secretKey: z.string()
})