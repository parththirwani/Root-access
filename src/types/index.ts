import { DisplayStyle } from "@/prisma/generated/client";

export interface Profile {
  id: string;
  bio: string | null;
  xLink: string | null;
  instagramLink: string | null;
  linkedinLink: string | null;
  email: string | null;
  resumeUrl: string | null;
}

export interface TopCategory {
  id: string;
  name: string;
  isVisible: boolean;
  subsections: Subsection[];
}


export interface Subsection {
  id: string;
  name: string;
  slug: string;
  icon: string;
  isVisible: boolean;
  postCount: number;
  displayStyle: DisplayStyle;
  topCategoryId: string;
  topCategory?: {
    name: string;
  };
  posts?: Post[];
}

export interface Post {
  id: string;
  title: string;
  description: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
  views: number;
  readTime: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  // Project-specific field
  projectLink: string | null;
  subsection: {
    name: string;
    slug: string;
    displayStyle: DisplayStyle;
    topCategory?: {
      name: string;
    };
  };
  tags: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  posts?: Post[];
}

export interface Admin {
  id: string;
  email: string;
  name: string;
}