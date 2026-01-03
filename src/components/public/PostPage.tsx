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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'Post not found'}</p>
          <Link href="/" className="text-gray-900 underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link 
          href={`/${slug}`} 
          className="text-sm text-gray-600 hover:text-gray-900 mb-8 inline-block"
        >
          ← Back to {post.subsection.name}
        </Link>

        <header className="mb-8">
          <time className="text-sm text-gray-500">
            {post.publishedAt &&
              new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
          </time>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
            {post.title}
          </h1>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-lg mb-8"
          />
        )}

        <div 
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{post.views} views</span>
            {post.readTime && <span>{post.readTime} min read</span>}
          </div>
        </footer>
      </article>
    </div>
  );
}