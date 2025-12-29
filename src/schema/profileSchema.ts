import {z} from "zod"

export const updateProfileSchema = z.object({
  bio: z.string().nullable().optional(),
  xLink: z.string().url().nullable().optional(),
  instagramLink: z.string().url().nullable().optional(),
  linkedinLink: z.string().url().nullable().optional(),
});
