import { z } from "zod";

export const postsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().optional(), // Optional for some display styles
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  
  // Display style configuration
  displayStyle: z.enum(["blog", "project", "title_only"]).default("blog"),
  projectLink: z.string().url().optional().or(z.literal("")),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  
  // Display style configuration
  displayStyle: z.enum(["blog", "project", "title_only"]).optional(),
  projectLink: z.string().url().optional().or(z.literal("")),
});