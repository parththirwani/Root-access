import {z} from "zod"

export const sectionsSchema = z.object({
    name: z.string().min(1,"Name should be atleast 1 char"),
    isVisible: z.boolean().default(true),
})

export const updateSectionSchema = sectionsSchema.partial()
