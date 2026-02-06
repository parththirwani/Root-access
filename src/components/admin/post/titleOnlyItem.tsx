import { Post } from '@/src/types';

interface TitleOnlyItemProps {
  post: Post;
}

export function TitleOnlyItem({ post }: TitleOnlyItemProps) {
  const date = new Date(post.publishedAt??Date.now()).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short'
  });

  return (
    <div className="block">
      <div className="flex items-start gap-4">
        <time className="text-xs text-neutral-600 pt-1 w-12 shrink-0">{date}</time>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-normal text-neutral-300 leading-snug">
            {post.title}
          </h3>
        </div>
      </div>
    </div>
  );
}