'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Tag {
  name: string;
}

interface Post {
  title: string;
  slug: string;
  publishedAt: string | null;
  excerpt: string | null;
  description: string;
  coverImage: string | null;
  projectLink: string | null;
  tags: Tag[];
}

interface Subsection {
  name: string;
  displayStyle: string;
  posts?: Post[];
  topCategory?: {
    name: string;
  };
}

export function SubsectionContent({
  subsection,
  slug,
}: {
  subsection: Subsection;
  slug: string;
}) {
  const [activeFilter, setActiveFilter] = useState('All');

  const allTags = new Set<string>();
  subsection.posts?.forEach((post) =>
    post.tags?.forEach((tag) => allTags.add(tag.name))
  );

  const uniqueTags = ['All', ...Array.from(allTags)];

  const filteredPosts =
    activeFilter === 'All'
      ? subsection.posts ?? []
      : subsection.posts?.filter((post) =>
          post.tags?.some((tag) => tag.name === activeFilter)
        ) ?? [];

  // Sort posts by publishedAt descending
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.publishedAt ?? 0).getTime();
    const dateB = new Date(b.publishedAt ?? 0).getTime();
    return dateB - dateA;
  });

  // Group by year
  const postsByYear: Record<string, Post[]> = {};
  sortedPosts.forEach((post) => {
    const year = new Date(post.publishedAt ?? Date.now())
      .getFullYear()
      .toString();
    if (!postsByYear[year]) {
      postsByYear[year] = [];
    }
    postsByYear[year].push(post);
  });

  const sortedYears = Object.keys(postsByYear).sort((a, b) => +b - +a);
  const displayStyle = subsection.displayStyle;

  const renderPost = (post: Post) => {
    const tags = post.tags ?? [];
    const date = new Date(post.publishedAt ?? Date.now()).toLocaleDateString(
      'en-US',
      {
        day: 'numeric',
        month: 'short',
      }
    );

    // Title Only Style
    if (displayStyle === 'TITLE_ONLY') {
      return (
        <div key={post.slug} className="block">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
            <time className="text-xs text-neutral-600 sm:pt-1 sm:w-12 shrink-0">
              {date}
            </time>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-normal text-neutral-300 leading-snug mb-1 wrap-break-word">
                {post.title}
              </h3>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.slice(0, 3).map((tag) => (
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
        </div>
      );
    }

    // Project Card Style - Professional design without emoji
    if (displayStyle === 'PROJECT') {
      const projectUrl = post.projectLink || '#';

      return (
        <div key={post.slug} className="block group h-full">
          <Link
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <div className="bg-[#101010] rounded-2xl border border-[#1a1a1a] p-4 sm:p-6 hover:border-[#2a2a2a] transition-all duration-200 h-full flex flex-col cursor-pointer">
              {/* Header with external link icon */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] sm:text-[15px] font-medium text-white group-hover:text-neutral-300 transition wrap-break-word">
                    {post.title}
                  </h3>
                </div>
                <svg
                  className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition shrink-0 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>

              {/* Cover Image (if present) */}
              {post.coverImage && (
                <div className="mb-3 sm:mb-4 rounded-lg overflow-hidden bg-[#1a1a1a]">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-32 sm:h-40 object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <p className="text-[12px] sm:text-[13px] text-neutral-500 leading-relaxed mb-3 sm:mb-4 flex-1 line-clamp-3">
                {post.description}
              </p>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1a1a1a]">
                  {tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.name}
                      className="px-2 py-1 text-[10px] sm:text-[11px] rounded bg-[#1a1a1a] text-neutral-600"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        </div>
      );
    }

    // Blog Style
    return (
      <Link
        key={post.slug}
        href={`/${slug}/${post.slug}`}
        className="block group"
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
          <time className="text-xs text-neutral-600 sm:pt-1 sm:w-12 shrink-0">
            {date}
          </time>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-normal text-neutral-300 group-hover:text-white transition leading-snug mb-1 wrap-break-word">
              {post.title}
            </h3>
            {post.description && (
              <p className="text-[13px] text-neutral-500 leading-relaxed mb-2 line-clamp-2">
                {post.description}
              </p>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.slice(0, 3).map((tag) => (
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
  };

  return (
    <main className="flex-1 md:ml-48 px-4 sm:px-6 md:px-12 py-6 sm:py-10 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl text-white font-light mb-2 wrap-break-word">
            {subsection.name}
          </h1>
          {subsection.topCategory && (
            <p className="text-sm text-neutral-500">
              {subsection.topCategory.name}
            </p>
          )}
        </div>

        {/* Filters */}
        {uniqueTags.length > 1 && (
          <div className="mb-8 sm:mb-10 pb-4 border-b border-[#1a1a1a]">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {uniqueTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg whitespace-nowrap cursor-pointer transition ${
                    activeFilter === tag
                      ? 'bg-white text-[#101011]'
                      : 'bg-[#1a1a1a] text-neutral-400 hover:bg-[#252525] hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Posts Layout */}
        {displayStyle === 'PROJECT' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {sortedPosts.map((post) => renderPost(post))}
          </div>
        ) : (
          <div className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24">
            {sortedYears.map((year) => (
              <div key={year} className="space-y-4 sm:space-y-6">
                <h2 className="text-xs sm:text-sm uppercase tracking-wider text-neutral-500">
                  {year}
                </h2>
                <div className="space-y-6 sm:space-y-8">
                  {postsByYear[year].map((post) => renderPost(post))}
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedPosts.length === 0 && (
          <p className="text-sm text-neutral-500 mt-12 sm:mt-20 text-center">
            No posts yet.
          </p>
        )}
      </div>

      {/* Add custom scrollbar hiding for horizontal scroll */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}