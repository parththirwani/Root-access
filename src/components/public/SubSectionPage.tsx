'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicApi } from '@/src/lib/api';
import { PublicSidebar } from './Sidebar';
import { DisplayStyle } from '@/src/types';

interface SubsectionPageProps {
  slug: string;
}

interface Tag {
  name: string;
}

interface Post {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  excerpt: string | null;
  coverImage: string | null;
  displayStyle: DisplayStyle;
  projectLink: string | null;
  tags?: Tag[];
}

interface Subsection {
  name: string;
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

  const postsByYear: Record<string, Post[]> = {};
  filteredPosts.forEach(post => {
    const year = new Date(post.publishedAt).getFullYear().toString();
    (postsByYear[year] ??= []).push(post);
  });

  const sortedYears = Object.keys(postsByYear).sort((a, b) => +b - +a);

  // Render different post styles
  const renderPost = (post: Post) => {
    const tags = post.tags ?? [];
    const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });

    // Title Only Style
    if (post.displayStyle === 'title-only') {
      return (
        <div key={post.slug} className="block group">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <div className="flex-1 min-w-0">
              <time className="block text-xs text-neutral-500 mb-1">{date}</time>
              <h3 className="text-lg font-light text-neutral-300 group-hover:text-white transition leading-snug">
                {post.title}
              </h3>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 md:max-w-[40%] md:justify-end">
                {tags.slice(0, 4).map(tag => (
                  <span
                    key={tag.name}
                    className="px-3 py-1 text-xs rounded-lg bg-[#1a1a1a] text-neutral-500"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Project Card Style
    if (post.displayStyle === 'project') {
      return (
        <a
          key={post.slug}
          href={post.projectLink || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="bg-[#101010] rounded-xl border border-[#1a1a1a] p-6 hover:border-[#2a2a2a] transition">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-medium text-white group-hover:text-white/80 transition flex items-center gap-2">
                {post.title}
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </h3>
              <time className="text-xs text-neutral-500 whitespace-nowrap">{date}</time>
            </div>
            <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{post.description}</p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 4).map(tag => (
                  <span
                    key={tag.name}
                    className="px-3 py-1 text-xs rounded-lg bg-[#1a1a1a] text-neutral-500"
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

    // Blog Style (default)
    return (
      <Link
        key={post.slug}
        href={`/${slug}/${post.slug}`}
        className="block group"
      >
        <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6">
          {post.coverImage && (
            <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-[#1a1a1a] shrink-0">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <time className="block text-xs text-neutral-500 mb-1">{date}</time>
            <h3 className="text-lg font-light text-neutral-300 group-hover:text-white transition leading-snug mb-2">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-sm text-neutral-500 line-clamp-2 mb-3">{post.excerpt}</p>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 4).map(tag => (
                  <span
                    key={tag.name}
                    className="px-3 py-1 text-xs rounded-lg bg-[#1a1a1a] text-neutral-500"
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

            {/* Posts by Year */}
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