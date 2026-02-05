import Link from 'next/link';
import { Post } from '@/src/types';

interface BlogPostItemProps {
  post: Post;
  subsectionSlug: string;
}

export function BlogPostItem({ post, subsectionSlug }: BlogPostItemProps) {
  const tags = post.tags ?? [];
  const date = new Date(post.publishedAt??Date.now()).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short'
  });

  return (
    <Link
      href={`/${subsectionSlug}/${post.slug}`}
      className="block group"
    >
      <div className="flex items-start gap-4">
        <time className="text-xs text-neutral-600 pt-1 w-12 shrink-0">{date}</time>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-normal text-neutral-300 group-hover:text-white transition leading-snug mb-1">
            {post.title}
          </h3>
          {post.description && (
            <p className="text-[13px] text-neutral-500 leading-relaxed mb-2">
              {post.description}
            </p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.slice(0, 3).map(tag => (
                <span
                  key={tag.name}
                  className="px-2 py-1 text-[11px] rounded bg-[#1a1a1a] text-neutral-600"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}