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
      {/* Add top padding to create space below sticky breadcrumb */}
      <div className="flex justify-center px-4 sm:px-6 md:px-8 lg:px-20 pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-12 md:pb-16">
        <article className="w-full max-w-3xl">
          {/* Copy Button */}
          <div className="flex justify-end mb-4 sm:mb-6">
            <button
              onClick={handleCopyPage}
              className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white cursor-pointer transition touch-manipulation"
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
          <header className="mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-[40px] text-white leading-tight mb-3 wrap-break-word">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-sm sm:text-base text-neutral-400 mb-3 sm:mb-4 wrap-break-word">
                {post.description}
              </p>
            )}

            {post.publishedAt && (
              <time className="text-xs text-neutral-500">
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
              className="rounded-lg mb-8 sm:mb-10 md:mb-12 w-full h-auto"
            />
          )}

          {/* Body - Responsive typography */}
          <div
            className="
              prose prose-invert max-w-none mb-8 sm:mb-10 md:mb-12
              prose-headings:break-words
              prose-p:break-words
              prose-a:break-words
              prose-li:break-words
              prose-sm sm:prose-base
              prose-img:rounded-lg
              prose-img:w-full
              prose-img:h-auto
              prose-pre:overflow-x-auto
              prose-pre:max-w-full
              prose-code:break-words
              prose-table:block
              prose-table:overflow-x-auto
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer */}
          <footer className="border-t border-black pt-4 sm:pt-6 flex justify-end">
            <span className="text-xs text-neutral-500">
              {post.views.toLocaleString()} views
            </span>
          </footer>
        </article>
      </div>
    </div>
  );
}