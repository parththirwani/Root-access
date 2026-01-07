'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicApi } from '@/src/lib/api';
import { PublicSidebar } from './Sidebar';

interface SubsectionPageProps {
  slug: string;
}

interface Tag {
  name: string;
}

interface Post {
  slug: string;
  title: string;
  publishedAt: string;
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

  /* ---------- Loading / Error ---------- */

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

  /* ---------- Derived Data ---------- */

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

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-[#101011]">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block">
          <PublicSidebar />
        </div>

        {/* Main Content */}
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

            {/* Posts */}
            <div className="space-y-20 md:space-y-24">
              {sortedYears.map(year => (
                <div key={year} className="space-y-6">
                  <h2 className="text-sm uppercase tracking-wider text-neutral-500">
                    {year}
                  </h2>

                  <div className="space-y-8">
                    {postsByYear[year].map(post => {
                      const tags = post.tags ?? [];

                      return (
                        <Link
                          key={post.slug}
                          href={`/${slug}/${post.slug}`}
                          className="block group"
                        >
                          <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6">
                            {/* Title */}
                            <div className="flex-1 min-w-0">
                              <time className="block text-xs text-neutral-500 mb-1">
                                {new Date(post.publishedAt).toLocaleDateString(
                                  'en-US',
                                  { month: 'long', day: 'numeric' }
                                )}
                              </time>
                              <h3 className="text-lg font-light text-neutral-300 group-hover:text-white transition leading-snug">
                                {post.title}
                              </h3>
                            </div>

                            {/* Tags — FIXED */}
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
                        </Link>
                      );
                    })}
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
