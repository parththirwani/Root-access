import {z} from "zod"

export const sectionsSchema = z.object({
    name: z.string(),
    isVisible: z.boolean().default(true),
})

export const updateSectionSchema = sectionsSchema.partial()
