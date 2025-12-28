import {z} from "zod"

export const subsectionsSchema = z.object({
    name: z.string().min(1,"Name should be atleast 1 char"),
    isVisible: z.boolean().default(true),
    icon: z.string().min(1,"Icon should be atleast 1 char"),
    topCategoryName: z.string().min(1,"Category name should be atleast 1 char")
})

export const updateSubsectionSchema = subsectionsSchema.partial()
