export type DisplayStyleType = 'BLOG' | 'PROJECT' | 'TITLE_ONLY';

export const DisplayStyleEnum = {
  BLOG: 'BLOG' as const,
  PROJECT: 'PROJECT' as const,
  TITLE_ONLY: 'TITLE_ONLY' as const,
} as const;

export function isDisplayStyle(value: string): value is DisplayStyleType {
  return value === 'BLOG' || value === 'PROJECT' || value === 'TITLE_ONLY';
}