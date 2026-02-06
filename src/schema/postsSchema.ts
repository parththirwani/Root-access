import { z } from "zod";

export const postsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""), // Optional for title_only posts
  content: z.string().optional(), // Optional - may be empty for project/title_only subsections
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  
  // Project-specific field (only used when subsection displayStyle is 'project')
  projectLink: z.string().url().optional().or(z.literal("")),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  
  // Project-specific field
  projectLink: z.string().url().optional().or(z.literal("")),
});