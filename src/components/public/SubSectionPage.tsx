'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicApi } from '@/src/lib/api';

interface SubsectionPageProps {
  slug: string;
}

export function SubsectionPage({ slug }: SubsectionPageProps) {
  const [subsection, setSubsection] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await publicApi.getSubsection(slug);
        setSubsection((res as any).subsection);
      } catch (err: any) {
        setError(err.message || 'Failed to load subsection');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#707070]">Loading...</div>
      </div>
    );
  }

  if (error || !subsection) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium text-white mb-2">Not Found</h1>
          <p className="text-[#707070] mb-6 text-[14px]">{error || 'Subsection not found'}</p>
          <Link href="/" className="text-[#e5e5e5] hover:text-white transition text-[14px] underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  // Get unique tags from posts
  const allTags = new Set<string>();
  subsection.posts?.forEach((post: any) => {
    post.tags?.forEach((tag: any) => allTags.add(tag.name));
  });
  const uniqueTags = ['All', ...Array.from(allTags)];

  // Filter posts based on active filter
  const filteredPosts = activeFilter === 'All' 
    ? subsection.posts 
    : subsection.posts?.filter((post: any) => 
        post.tags?.some((tag: any) => tag.name === activeFilter)
      );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-170 mx-auto px-6">
        <main className="py-12">
          {/* Subsection Title */}
          <div className="mb-12">
            <Link
              href="/"
              className="text-[#707070] hover:text-white transition text-[13px] mb-4 inline-block"
            >
              ← Home
            </Link>
            <h1 className="text-white text-[28px] font-normal mb-2">
              {subsection.name}
            </h1>
            {subsection.topCategory && (
              <p className="text-[#707070] text-[14px]">{subsection.topCategory.name}</p>
            )}
          </div>

          {/* Filter Tabs */}
          {uniqueTags.length > 1 && (
            <div className="mb-8 border-b border-[#1a1a1a]">
              <div className="flex gap-6 overflow-x-auto">
                {uniqueTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveFilter(tag)}
                    className={`pb-3 text-[14px] whitespace-nowrap border-b-2 transition ${
                      activeFilter === tag
                        ? 'text-white border-white'
                        : 'text-[#707070] hover:text-white border-transparent'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Year Header */}
          <div className="mb-4">
            <h2 className="text-[#707070] text-[13px] font-normal">
              {new Date().getFullYear()}
            </h2>
          </div>

          {/* Posts List */}
          {filteredPosts && filteredPosts.length > 0 ? (
            <div className="space-y-0">
              {filteredPosts.map((post: any) => (
                <Link
                  key={post.title}
                  href={`/${slug}/${post.slug}`}
                  className="block py-4 border-b border-[#1a1a1a] hover:opacity-70 transition group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <time className="text-[#707070] text-[13px] mb-1 block">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      <h3 className="text-[#e5e5e5] text-[15px] font-normal group-hover:text-white transition">
                        {post.title}
                      </h3>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 shrink-0">
                        {post.tags.slice(0, 3).map((tag: any) => (
                          <span
                            key={tag.name}
                            className="px-2 py-0.5 bg-[#1a1a1a] text-[#707070] text-[11px] rounded"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[#707070] text-[14px]">No posts yet.</p>
          )}
        </main>
      </div>
    </div>
  );
}