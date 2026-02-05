export interface Profile {
  id: string;
  bio: string | null;
  xLink: string | null;
  instagramLink: string | null;
  linkedinLink: string | null;
}

export interface TopCategory {
  id: string;
  name: string;
  isVisible: boolean;
  subsections: Subsection[];
}

// Display style enum - defines how posts in a subsection are rendered
export type DisplayStyle = "blog" | "project" | "title_only";

export interface Subsection {
  id: string;
  name: string;
  slug: string;
  icon: string;
  isVisible: boolean;
  postCount: number;
  displayStyle: DisplayStyle;  // Display style for this subsection
  topCategoryId: string;
  topCategory?: {
    name: string;
  };
  posts?: Post[];
}

export interface Post {
  id: string;
  title: string;
  description: string;  // Short description (always required)
  slug: string;
  content: string;      // Full content (may be empty for some styles)
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
  views: number;
  readTime: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  
  // Project-specific field
  projectLink: string | null;  // External link (for project style)
  
  subsection: {
    name: string;
    slug: string;
    displayStyle: DisplayStyle;  // Inherited from subsection
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