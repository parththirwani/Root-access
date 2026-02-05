'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicApi } from '@/src/lib/api';
import { PublicSidebar } from './Sidebar';
import { Post } from '@/src/types';

interface SubsectionPageProps {
  slug: string;
}

interface Subsection {
  name: string;
  displayStyle: string; // Prisma enum
  posts?: Post[];
  topCategory?: {
    name: string;
  };
}

export function SubsectionPage({ slug }: SubsectionPageProps) {
  const [subsection, setSubsection] = useState<Subsection | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const subsectionRes = await publicApi.getSubsection(slug);
        setSubsection((subsectionRes as any)?.subsection ?? null);
      } catch (err: any) {
        setError(err?.message || 'Failed to load subsection');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101011] flex items-center justify-center">
        <span className="text-sm text-neutral-500">Loading...</span>
      </div>
    );
  }

  if (!subsection || error) {
    return (
      <div className="min-h-screen bg-[#101011] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg text-white mb-2">Not Found</h1>
          <p className="text-sm text-neutral-500 mb-6">
            {error || 'Subsection not found'}
          </p>
          <Link
            href="/"
            className="text-sm text-neutral-400 hover:text-white underline"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const allTags = new Set<string>();
  subsection.posts?.forEach(post =>
    post.tags?.forEach(tag => allTags.add(tag.name))
  );

  const uniqueTags = ['All', ...Array.from(allTags)];

  const filteredPosts =
    activeFilter === 'All'
      ? subsection.posts ?? []
      : subsection.posts?.filter(post =>
          post.tags?.some(tag => tag.name === activeFilter)
        ) ?? [];

  // Group posts by year for timeline layouts
  const postsByYear: Record<string, Post[]> = {};
  filteredPosts.forEach(post => {
    const year = new Date(post.publishedAt ?? Date.now()).getFullYear().toString();
    (postsByYear[year] ??= []).push(post);
  });

  const sortedYears = Object.keys(postsByYear).sort((a, b) => +b - +a);

  // Use subsection's display style (Prisma enum)
  const displayStyle = subsection.displayStyle;

  // Render post based on subsection's display style
  const renderPost = (post: Post) => {
    const tags = post.tags ?? [];
    const date = new Date(post.publishedAt ?? Date.now()).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });

    // Title Only Style - Simple list item (non-clickable)
    if (displayStyle === 'TITLE_ONLY') {
      return (
        <div key={post.slug} className="block">
          <div className="flex items-start gap-4">
            <time className="text-xs text-neutral-600 pt-1 w-12 shrink-0">{date}</time>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-normal text-neutral-300 leading-snug mb-1">
                {post.title}
              </h3>
              {post.description && (
                <p className="text-[13px] text-neutral-500 leading-relaxed">
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
        </div>
      );
    }

    // Project Card Style - Grid card with hover effect
    if (displayStyle === 'PROJECT') {
      return (
        <a
          key={post.slug}
          href={post.projectLink || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="bg-[#101010] rounded-2xl border border-[#1a1a1a] p-6 hover:border-[#2a2a2a] transition-all duration-200 h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-lg">
                {post.coverImage ? (
                  <img src={post.coverImage} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  '🚀'
                )}
              </div>
              <svg className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            
            <h3 className="text-[15px] font-normal text-white mb-2 group-hover:text-neutral-300 transition">
              {post.title}
            </h3>
            
            <p className="text-[13px] text-neutral-500 leading-relaxed mb-4 flex-1">
              {post.description}
            </p>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1a1a1a]">
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
        </a>
      );
    }

    // Blog Style (default) - Timeline list with date and clickable to full post
    return (
      <Link
        key={post.slug}
        href={`/${slug}/${post.slug}`}
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
  };

  return (
    <div className="min-h-screen bg-[#101011]">
      <div className="flex">
        <div className="hidden md:block">
          <PublicSidebar />
        </div>

        <main className="flex-1 md:ml-48 px-6 md:px-12 py-10 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-10 md:mb-12">
              <h1 className="text-2xl md:text-3xl text-white font-light mb-2">
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
              <div className="mb-10 pb-4 border-b border-[#1a1a1a]">
                <div className="flex gap-2 overflow-x-auto">
                  {uniqueTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setActiveFilter(tag)}
                      className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap cursor-pointer transition ${
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

            {/* Posts Layout - Based on Subsection Display Style */}
            {displayStyle === 'PROJECT' ? (
              // Grid layout for project style
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts.map(post => renderPost(post))}
              </div>
            ) : (
              // Timeline layout for blog and title_only styles
              <div className="space-y-20 md:space-y-24">
                {sortedYears.map(year => (
                  <div key={year} className="space-y-6">
                    <h2 className="text-sm uppercase tracking-wider text-neutral-500">
                      {year}
                    </h2>

                    <div className="space-y-8">
                      {postsByYear[year].map(post => renderPost(post))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredPosts.length === 0 && (
              <p className="text-sm text-neutral-500 mt-20 text-center">
                No posts yet.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}