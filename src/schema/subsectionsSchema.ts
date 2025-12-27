import {z} from "zod"

export const subsectionsSchema = z.object({
    name: z.string(),
    isVisible: z.boolean().default(true),
    icon: z.string(),
    topCategoryName: z.string()
})

export const updateSubsectionSchema = subsectionsSchema.partial()
