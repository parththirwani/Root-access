'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicApi } from '@/src/lib/api';
import { PublicSidebar } from '../../public/Sidebar';
import { FilterBar } from '../post/filterBar';
import { PostList } from '../post/postList';


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
  displayStyle: 'blog' | 'project' | 'title_only';
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

  // Extract unique tags
  const allTags = new Set<string>();
  subsection.posts?.forEach(post =>
    post.tags?.forEach(tag => allTags.add(tag.name))
  );
  const uniqueTags = ['All', ...Array.from(allTags)];

  // Filter posts
  const filteredPosts =
    activeFilter === 'All'
      ? subsection.posts ?? []
      : subsection.posts?.filter(post =>
          post.tags?.some(tag => tag.name === activeFilter)
        ) ?? [];

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

            {/* Filter Bar */}
            <FilterBar
              tags={uniqueTags}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Posts */}
            <PostList posts={filteredPosts} subsectionSlug={slug} />
          </div>
        </main>
      </div>
    </div>
  );
}