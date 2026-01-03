'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicApi } from '@/src/lib/api';


interface SubsectionPageProps {
  slug: string;
}

export function SubsectionPage({ slug }: SubsectionPageProps) {
  const [subsection, setSubsection] = useState<any>(null);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !subsection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'Subsection not found'}</p>
          <Link href="/" className="text-gray-900 underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 mb-8 inline-block">
          ← Back
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{subsection.icon}</span>
            <h1 className="text-4xl font-bold text-gray-900">
              {subsection.name}
            </h1>
          </div>
          {subsection.topCategory && (
            <p className="text-gray-600">{subsection.topCategory.name}</p>
          )}
        </header>

        {subsection.posts && subsection.posts.length > 0 ? (
          <div className="space-y-8">
            {subsection.posts.map((post: any) => (
              <article key={post.title} className="border-b border-gray-200 pb-8 last:border-0">
                <Link href={`/${slug}/${post.slug}`} className="group">
                  <time className="text-sm text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                  <h2 className="text-2xl font-semibold text-gray-900 mt-2 group-hover:underline">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-700 mt-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {post.tags.map((tag: any) => (
                        <span
                          key={tag.name}
                          className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No posts yet.</p>
        )}
      </main>
    </div>
  );
}