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
      <div className="flex justify-center px-4 sm:px-6 md:px-10 lg:px-16 pt-6 sm:pt-8 md:pt-10 pb-10 sm:pb-14 md:pb-16">
        <article className="w-full max-w-2xl">
          {/* Copy Button */}
          <div className="flex justify-end mb-4 sm:mb-6">
            <button
              onClick={handleCopyPage}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white cursor-pointer transition touch-manipulation py-1"
            >
              <svg
                className="w-3.5 h-3.5 shrink-0"
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
          <header className="mb-7 sm:mb-9 md:mb-12">
            <h1 className="text-[26px] sm:text-3xl md:text-[38px] text-white leading-tight mb-3 wrap-break-word hyphens-auto">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-sm sm:text-[15px] text-neutral-400 mb-3 wrap-break-word leading-relaxed">
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

          {/* Cover Image */}
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="rounded-lg mb-7 sm:mb-10 w-full h-auto"
            />
          )}

          {/* Body */}
          <div
            className="
              prose prose-invert max-w-none mb-8 sm:mb-12
              prose-sm sm:prose-base
              prose-p:text-neutral-300
              prose-p:leading-relaxed
              prose-p:text-justify
              prose-p:break-words
              prose-headings:text-white
              prose-headings:break-words
              prose-headings:leading-tight
              prose-h1:text-2xl sm:prose-h1:text-3xl
              prose-h2:text-xl sm:prose-h2:text-2xl
              prose-h3:text-lg sm:prose-h3:text-xl
              prose-a:text-white
              prose-a:underline
              prose-a:break-all
              prose-strong:text-white
              prose-code:text-neutral-300
              prose-code:bg-[#1a1a1a]
              prose-code:px-1
              prose-code:py-0.5
              prose-code:rounded
              prose-code:text-xs
              prose-code:sm:text-sm
              prose-code:before:content-none
              prose-code:after:content-none
              prose-code:break-all
              prose-pre:overflow-x-auto
              prose-pre:max-w-full
              prose-pre:text-xs
              prose-pre:sm:text-sm
              prose-pre:rounded-lg
              prose-pre:p-3
              prose-pre:sm:p-4
              prose-blockquote:border-neutral-600
              prose-blockquote:text-neutral-400
              prose-img:rounded-lg
              prose-img:w-full
              prose-img:h-auto
              prose-ul:text-neutral-300
              prose-ol:text-neutral-300
              prose-li:text-neutral-300
              prose-li:break-words
              prose-table:block
              prose-table:overflow-x-auto
              prose-table:text-sm
              prose-td:break-words
              prose-th:break-words
              [&_pre]:overflow-x-auto
              [&_pre]:max-w-full
              [&_pre_code]:break-normal
              [&_pre_code]:whitespace-pre
              [&_code]:wrap-break-word
              [&_table]:w-full
              [&_img]:rounded-lg
              [&_img]:w-full
              [&_img]:h-auto
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer */}
          <footer className="border-t border-black pt-4 flex justify-end">
            <span className="text-xs text-neutral-500">
              {post.views.toLocaleString()} views
            </span>
          </footer>
        </article>
      </div>
    </div>
  );
}