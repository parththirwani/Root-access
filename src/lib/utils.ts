/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/--+/g, '-')      // Replace multiple hyphens with single
    .trim();
}

/**
 * Calculate estimated reading time based on word count
 * @param content - The content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Estimated reading time in minutes
 */
export function calculateReadTime(content: string, wordsPerMinute: number = 200): number {
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Handle tag creation/retrieval for posts
 * @param tags - Array of tag names
 * @param prisma - Prisma client instance
 * @returns Array of tag connection objects
 */
export async function handleTags(tags: string[], prisma: any): Promise<{ id: string }[]> {
  const tagConnections: { id: string }[] = [];
  
  if (!tags || tags.length === 0) {
    return tagConnections;
  }

  for (const tagName of tags) {
    const tagSlug = generateSlug(tagName);
    
    // Find or create tag
    const tag = await prisma.tag.upsert({
      where: { slug: tagSlug },
      update: {},
      create: {
        name: tagName,
        slug: tagSlug
      }
    });
    
    tagConnections.push({ id: tag.id });
  }

  return tagConnections;
}

/**
 * Generate excerpt from content if not provided
 * @param content - The full content
 * @param excerpt - Optional existing excerpt
 * @param maxLength - Maximum excerpt length (default: 150)
 * @returns Excerpt string
 */
export function generateExcerpt(content: string, excerpt?: string, maxLength: number = 150): string {
  if (excerpt) {
    return excerpt;
  }
  
  // Remove markdown formatting for cleaner excerpt
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*|__/g, '')  // Remove bold
    .replace(/\*|_/g, '')     // Remove italic
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links, keep text
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + "...";
}