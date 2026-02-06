import { Post } from '@/src/types';
import { PostCard } from './postCard';
import { TitleOnlyItem } from './titleOnlyItem';
import { BlogPostItem } from './blogPost';


interface PostListProps {
  posts: Post[];
  subsectionSlug: string;
}

export function PostList({ posts, subsectionSlug }: PostListProps) {
  if (posts.length === 0) {
    return (
      <p className="text-sm text-neutral-500 mt-20 text-center">
        No posts yet.
      </p>
    );
  }

  // Check if all posts are projects for grid layout
  const isProjectSection = posts.every(p => p.subsection.displayStyle === 'PROJECT');

  // Render project grid
  if (isProjectSection) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    );
  }

  // Group posts by year for timeline layout
  const postsByYear: Record<string, Post[]> = {};
  posts.forEach(post => {
    const year = new Date(post.publishedAt??Date.now()).getFullYear().toString();
    (postsByYear[year] ??= []).push(post);
  });

  const sortedYears = Object.keys(postsByYear).sort((a, b) => +b - +a);

  // Render timeline layout
  return (
    <div className="space-y-20 md:space-y-24">
      {sortedYears.map(year => (
        <div key={year} className="space-y-6">
          <h2 className="text-sm uppercase tracking-wider text-neutral-500">
            {year}
          </h2>

          <div className="space-y-8">
            {postsByYear[year].map(post => {
              if (post.subsection.displayStyle === 'TITLE_ONLY') {
                return <TitleOnlyItem key={post.slug} post={post} />;
              }
              if (post.subsection.displayStyle === 'PROJECT') {
                return <PostCard key={post.slug} post={post} />;
              }
              return <BlogPostItem key={post.slug} post={post} subsectionSlug={subsectionSlug} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}