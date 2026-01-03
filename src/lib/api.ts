// src/lib/api.ts (UPDATED)

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: 'include', // Important: Include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}

// Public APIs (no auth required)
export const publicApi = {
  getProfile: () => fetcher('/api/public/profile'),
  getSubsections: () => fetcher('/api/public/subsections'),
  getSubsection: (slug: string) => fetcher(`/api/public/subsections/${slug}`),
  getPost: (postSlug: string) => fetcher(`/api/public/posts/${postSlug}`),
  getTags: () => fetcher('/api/public/tags'),
  getTag: (slug: string) => fetcher(`/api/public/tags/${slug}`),
};

// Admin APIs (auth required - cookies sent automatically)
export const adminApi = {
  login: (data: { email: string; secretKey: string }) =>
    fetcher('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    fetcher('/api/admin/logout', {
      method: 'POST',
    }),

  // Profile
  getProfile: () => fetcher('/api/admin/profile'),
  updateProfile: (data: any) =>
    fetcher('/api/admin/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Sections
  getSections: () => fetcher('/api/admin/sections'),
  createSection: (data: any) =>
    fetcher('/api/admin/sections', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSection: (id: string, data: any) =>
    fetcher(`/api/admin/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSection: (id: string) =>
    fetcher(`/api/admin/sections/${id}`, {
      method: 'DELETE',
    }),

  // Subsections
  createSubsection: (data: any) =>
    fetcher('/api/admin/subsections', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSubsection: (slug: string, data: any) =>
    fetcher(`/api/admin/subsections/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSubsection: (slug: string) =>
    fetcher(`/api/admin/subsections/${slug}`, {
      method: 'DELETE',
    }),

  // Posts
  getPosts: (subsectionSlug: string) =>
    fetcher(`/api/admin/subsections/${subsectionSlug}/posts`),
  createPost: (subsectionSlug: string, data: any) =>
    fetcher(`/api/admin/subsections/${subsectionSlug}/posts`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getPost: (subsectionSlug: string, postSlug: string) =>
    fetcher(`/api/admin/subsections/${subsectionSlug}/posts/${postSlug}`),
  updatePost: (subsectionSlug: string, postSlug: string, data: any) =>
    fetcher(`/api/admin/subsections/${subsectionSlug}/posts/${postSlug}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deletePost: (subsectionSlug: string, postSlug: string) =>
    fetcher(`/api/admin/subsections/${subsectionSlug}/posts/${postSlug}`, {
      method: 'DELETE',
    }),
  togglePublish: (subsectionSlug: string, postSlug: string, published: boolean) =>
    fetcher(`/api/admin/subsections/${subsectionSlug}/posts/${postSlug}`, {
      method: 'PATCH',
      body: JSON.stringify({ published }),
    }),

  // Tags
  getTags: () => fetcher('/api/admin/tags'),
  createTag: (data: any) =>
    fetcher('/api/admin/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTag: (tagSlug: string, data: any) =>
    fetcher(`/api/admin/tags/${tagSlug}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTag: (tagSlug: string) =>
    fetcher(`/api/admin/tags/${tagSlug}`, {
      method: 'DELETE',
    }),
};