'use client';

import { useState } from 'react';

interface Post {
  title: string;
  description: string;
  content: string;
  publishedAt: string | null;
  coverImage: string | null;
  views: number;
}

export function PostContent({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false);

  const handleCopyPage = async () => {
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

  return (
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
              <p className="text-neutral-400 mb-4">{post.description}</p>
            )}

            {post.publishedAt && (
              <time className="text-neutral-500 text-xs">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
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
  );
}