// src/types/api.ts

import { Post, Tag, TopCategory, Profile } from './index';

// API Response Types
export interface ApiResponse<T> {
  message?: string;
  [key: string]: any;
}

export interface ProfileResponse {
  profile: Profile;
}

export interface SectionsResponse {
  sections: TopCategory[];
}

export interface PostsResponse {
  posts: Post[];
}

export interface PostResponse {
  post: Post;
}

export interface TagsResponse {
  tags: Tag[];
}

export interface TagResponse {
  tag: Tag;
}

export interface SubsectionResponse {
  subsection: {
    name: string;
    posts?: Post[];
    topCategory?: {
      name: string;
    };
  };
}

export interface AdminNameResponse {
  name: string;
}