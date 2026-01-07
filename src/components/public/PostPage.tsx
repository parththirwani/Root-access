'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post } from '@/src/types';
import { publicApi } from '@/src/lib/api';

import { BreadcrumbNav } from './BreadcrumbNav';
import { PublicSidebar } from './Sidebar';

interface PostPageProps {
  slug: string;
  postSlug: string;
}

export function PostPage({ slug, postSlug }: PostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const postRes = await publicApi.getPost(postSlug);
        setPost((postRes as { post: Post }).post);
      } catch (err: any) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [postSlug]);

  const handleCopyPage = async () => {
    if (!post) return;

    const formattedDate = post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : '';

    const plainContent = post.content.replace(/<[^>]*>/g, '');
    const textToCopy = `${post.title}\n${formattedDate}\n\n${plainContent}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-normal text-white mb-2">Not Found</h1>
          <p className="text-neutral-500 mb-6 text-[14px]">{error || 'Post not found'}</p>
          <Link href="/" className="text-neutral-400 hover:text-white transition text-[14px] underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="flex">
        {/* Sidebar */}
        <PublicSidebar />

        {/* Main Content with rounded corners */}
        <main className="ml-48 flex-1 min-h-screen">
          <div className="p-6">
            <div className="bg-[#101010] rounded-2xl overflow-hidden border border-black shadow-[0_0_0_1px_rgba(0,0,0,0.5)]">
              {/* Breadcrumb Navigation - Sticky */}
              <BreadcrumbNav 
                items={[
                  { label: post.subsection.name, href: `/${slug}` },
                  { label: post.title }
                ]}
              />

              {/* Article Content */}
              <div className="flex justify-center px-20 py-16">
                <article className="w-full max-w-170">
                  {/* Copy Page Button - Top Right */}
                  <div className="flex justify-end mb-6">
                    <button
                      onClick={handleCopyPage}
                      className="flex items-center gap-2 text-[13px] text-neutral-500 hover:text-white transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>{copied ? 'Copied!' : 'Copy page'}</span>
                    </button>
                  </div>

                  {/* Article Header */}
                  <header className="mb-12">
                    <h1 className="text-white text-[40px] font-normal mb-3 leading-[1.1] tracking-tight">
                      {post.title}
                    </h1>
                    
                    {post.description && (
                      <p className="text-neutral-400 text-[16px] leading-relaxed mb-4">
                        {post.description}
                      </p>
                    )}

                    <time className="text-neutral-500 text-[13px] block">
                      {post.publishedAt &&
                        new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                    </time>
                  </header>

                  {/* Cover Image */}
                  {post.coverImage && (
                    <div className="mb-12">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}

                  {/* Post Content */}
                  <div 
                    className="prose prose-invert max-w-none mb-12"
                    style={{
                      color: '#a3a3a3',
                      fontSize: '16px',
                      lineHeight: '1.7',
                    }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {/* Post Footer */}
                  <footer className="pt-8 border-t border-black">
                    <div className="flex items-center justify-end">
                      <span className="text-[13px] text-neutral-500">
                        {post.views.toLocaleString()} views
                      </span>
                    </div>
                  </footer>
                </article>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}