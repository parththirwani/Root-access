/**
 * Serialize Prisma data for client components
 * Converts Date objects to ISO strings
 */

type SerializableDate = Date | null | undefined;
type SerializedDate = string | null;

/**
 * Serialize a single date to ISO string
 */
export function serializeDate(date: SerializableDate): SerializedDate {
  if (!date) return null;
  return date.toISOString();
}

/**
 * Serialize an object with dates to JSON-safe format
 * Handles nested objects and arrays
 */
export function serializeDates<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Date) {
    return obj.toISOString() as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => serializeDates(item)) as any;
  }

  if (typeof obj === 'object') {
    const serialized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeDates(value);
    }
    return serialized;
  }

  return obj;
}

/**
 * Helper to serialize Prisma post data
 */
export function serializePost<T extends { publishedAt?: Date | null; createdAt?: Date; updatedAt?: Date }>(
  post: T
): Omit<T, 'publishedAt' | 'createdAt' | 'updatedAt'> & {
  publishedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
} {
  return {
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt ? post.createdAt.toISOString() : undefined,
    updatedAt: post.updatedAt ? post.updatedAt.toISOString() : undefined,
  } as any;
}

/**
 * Helper to serialize multiple posts
 */
export function serializePosts<T extends { publishedAt?: Date | null }>(posts: T[]) {
  return posts.map(post => ({
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
  }));
}