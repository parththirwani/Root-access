'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post } from '@/src/types';
import { publicApi } from '@/src/lib/api';

interface PostPageProps {
  slug: string;
  postSlug: string;
}

export function PostPage({ slug, postSlug }: PostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await publicApi.getPost(postSlug);
        setPost((res as { post: Post }).post);
      } catch (err: any) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [postSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#707070]">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium text-white mb-2">Not Found</h1>
          <p className="text-[#707070] mb-6 text-[14px]">{error || 'Post not found'}</p>
          <Link href="/" className="text-[#e5e5e5] hover:text-white transition text-[14px] underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-170 mx-auto px-6">
        <article className="py-12">
          {/* Back Link */}
          <Link 
            href={`/${slug}`} 
            className="text-[#707070] hover:text-white transition text-[13px] mb-8 inline-block"
          >
            ← Back to {post.subsection.name}
          </Link>

          {/* Post Header */}
          <header className="mb-8">
            <time className="text-[#707070] text-[13px] block mb-2">
              {post.publishedAt &&
                new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
            </time>
            <h1 className="text-white text-[32px] font-normal mb-4 leading-tight">
              {post.title}
            </h1>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-[#1a1a1a] text-[#e5e5e5] text-[12px] rounded"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-8">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full rounded-lg"
              />
            </div>
          )}

          {/* Post Content */}
          <div 
            className="prose prose-invert max-w-none"
            style={{
              color: '#e5e5e5',
              fontSize: '15px',
              lineHeight: '1.7',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Post Footer */}
          <footer className="mt-12 pt-8 border-t border-[#1a1a1a]">
            <div className="flex items-center justify-between text-[13px] text-[#707070]">
              <span>{post.views} views</span>
              {post.readTime && <span>{post.readTime} min read</span>}
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}