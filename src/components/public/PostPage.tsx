'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post } from '@/src/types';
import { publicApi } from '@/src/lib/api';

import { BreadcrumbNav } from './BreadcrumbNav';
import { PublicSidebar } from './Sidebar';

interface PostPageProps {
  slug: string;
  postSlug: string;
}

export function PostPage({ slug, postSlug }: PostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await publicApi.getPost(postSlug);
        setPost((res as { post: Post }).post);
      } catch (err: any) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  const handleCopyPage = async () => {
    if (!post) return;

    const formattedDate = post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : '';

    const text = `${post.title}\n${formattedDate}\n\n${post.content.replace(
      /<[^>]*>/g,
      ''
    )}`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="text-neutral-500 text-sm">Loading…</span>
      </div>
    );
  }

  if (!post || error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-xl mb-2">Not Found</h1>
          <p className="text-neutral-500 text-sm mb-6">
            {error || 'Post not found'}
          </p>
          <Link href="/" className="underline text-sm text-neutral-400">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <PublicSidebar />

      <main className="flex-1 lg:ml-48">
        <div className="p-4 sm:p-6">

          {/* Sticky Breadcrumb */}
          <div className="sticky top-0 z-50 bg-[#101010]/95 backdrop-blur border-b border-black rounded-t-2xl">
            <BreadcrumbNav
              items={[
                { label: post.subsection.name, href: `/${slug}` },
                { label: post.title },
              ]}
            />
          </div>

          {/* Content */}
          <div className="bg-[#101010] rounded-b-2xl border border-black">
            <div className="overflow-hidden">
              <div className="flex justify-center px-4 sm:px-8 lg:px-20 py-10 sm:py-16">
                <article className="w-full max-w-3xl">

                  {/* Copy Button */}
                  <div className="flex justify-end mb-6">
                    <button
                      onClick={handleCopyPage}
                      className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white cursor-pointer transition"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      {copied ? 'Copied!' : 'Copy page'}
                    </button>
                  </div>

                  {/* Header */}
                  <header className="mb-12">
                    <h1 className="text-white text-3xl sm:text-[40px] leading-tight mb-3">
                      {post.title}
                    </h1>

                    {post.description && (
                      <p className="text-neutral-400 mb-4">
                        {post.description}
                      </p>
                    )}

                    {post.publishedAt && (
                      <time className="text-neutral-500 text-xs">
                        {new Date(post.publishedAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'long',
                            year: 'numeric',
                          }
                        )}
                      </time>
                    )}
                  </header>

                  {/* Image */}
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="rounded-lg mb-12"
                    />
                  )}

                  {/* Body */}
                  <div
                    className="prose prose-invert max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {/* Footer */}
                  <footer className="border-t border-black pt-6 flex justify-end">
                    <span className="text-xs text-neutral-500">
                      {post.views.toLocaleString()} views
                    </span>
                  </footer>
                </article>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
