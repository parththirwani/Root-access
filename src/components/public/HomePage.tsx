'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Profile, Subsection, Post, Tag } from '@/src/types';
import { publicApi } from '@/src/lib/api';

export function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, subsectionsRes, tagsRes] = await Promise.all([
          publicApi.getProfile(),
          publicApi.getSubsections(),
          publicApi.getTags(),
        ]);
        
        setProfile((profileRes as { profile: Profile }).profile);
        setSubsections((subsectionsRes as { subsections: Subsection[] }).subsections);
        setTags((tagsRes as { tags: Tag[] }).tags);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#707070]">Loading...</div>
      </div>
    );
  }

  // Separate writing and photos subsections
  const writingSubsection = subsections.find(s => 
    s.name.toLowerCase().includes('writing') || 
    s.topCategory?.name.toLowerCase().includes('craft')
  );
  
  const readingSubsection = subsections.find(s => 
    s.topCategory?.name.toLowerCase() === 'lists' &&
    (s.name.toLowerCase().includes('reading') || s.name.toLowerCase().includes('books'))
  );

  // Get recent writing posts
  const recentWriting = writingSubsection?.posts
    ?.filter(p => p.published)
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
    .slice(0, 5) || [];

  // Get recent reading posts
  const recentReading = readingSubsection?.posts
    ?.filter(p => p.published)
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
    .slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-170 mx-auto px-6">
        <main className="py-12">
          {/* Bio Section - Only show if bio exists */}
          {profile?.bio && (
            <section className="mb-16">
              <p className="text-[#e5e5e5] text-[15px] leading-relaxed">
                {profile.bio}
              </p>
              
              {/* Social Links */}
              {(profile.xLink || profile.linkedinLink || profile.instagramLink) && (
                <div className="flex gap-6 mt-6">
                  {profile.xLink && (
                    <a
                      href={profile.xLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#707070] hover:text-white transition text-[14px]"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                  {profile.linkedinLink && (
                    <a
                      href={profile.linkedinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#707070] hover:text-white transition text-[14px]"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                  {profile.instagramLink && (
                    <a
                      href={profile.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#707070] hover:text-white transition text-[14px]"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Writing Section - Only show if there are posts */}
          {recentWriting.length > 0 && writingSubsection && (
            <section className="mb-16">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-white text-[15px] font-normal">Writing</h2>
                <Link 
                  href={`/${writingSubsection.slug}`}
                  className="text-[#707070] hover:text-white transition text-[13px] flex items-center gap-1"
                >
                  See all
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Tags - Only show if tags exist */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {tags.slice(0, 8).map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/tags/${tag.slug}`}
                      className="px-3 py-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#e5e5e5] text-[13px] rounded-md transition"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}

              <div className="space-y-0 border-t border-[#1a1a1a]">
                {recentWriting.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${post.subsection.slug}/${post.slug}`}
                    className="block py-4 border-b border-[#1a1a1a] hover:opacity-70 transition group"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <time className="text-[#707070] text-[13px] mb-1 block">
                          {new Date(post.publishedAt!).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                        <h3 className="text-[#e5e5e5] text-[15px] font-normal group-hover:text-white transition">
                          {post.title}
                        </h3>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2 shrink-0">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
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
            </section>
          )}

          {/* Reading Section - Only show if there are posts */}
          {recentReading.length > 0 && readingSubsection && (
            <section className="mb-16">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-white text-[15px] font-normal">Reading</h2>
                <Link 
                  href={`/${readingSubsection.slug}`}
                  className="text-[#707070] hover:text-white transition text-[13px] flex items-center gap-1"
                >
                  See all
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="space-y-0 border-t border-[#1a1a1a]">
                {recentReading.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${post.subsection.slug}/${post.slug}`}
                    className="block py-4 border-b border-[#1a1a1a] hover:opacity-70 transition group"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <time className="text-[#707070] text-[13px] mb-1 block">
                          {new Date(post.publishedAt!).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                        <h3 className="text-[#e5e5e5] text-[15px] font-normal group-hover:text-white transition">
                          {post.title}
                        </h3>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2 shrink-0">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
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
            </section>
          )}
        </main>
      </div>
    </div>
  );
}