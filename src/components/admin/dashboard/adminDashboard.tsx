'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/src/lib/api';


export function AdminDashboard() {
  const [stats, setStats] = useState({
    sections: 0,
    subsections: 0,
    posts: 0,
    tags: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [sectionsResponse, tagsResponse] = await Promise.all([
          adminApi.getSections(),
          adminApi.getTags(),
        ]);

        const subsectionCount = (sectionsResponse as any).sections.reduce(
          (acc: number, section: any) => acc + (section.subsections?.length || 0),
          0
        );

        setStats({
          sections: (sectionsResponse as any).sections.length,
          subsections: subsectionCount,
          posts: 0, // You can calculate this from subsections if needed
          tags: (tagsResponse as any).tags.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Sections', value: stats.sections, href: '/admin/sections' },
    { label: 'Subsections', value: stats.subsections, href: '/admin/subsections' },
    { label: 'Posts', value: stats.posts, href: '/admin/posts' },
    { label: 'Tags', value: stats.tags, href: '/admin/tags' },
  ];

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-900 transition"
          >
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {card.value}
            </div>
            <div className="text-sm text-gray-600">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            href="/admin/sections"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Create Section
          </Link>
          <Link
            href="/admin/subsections"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Create Subsection
          </Link>
          <Link
            href="/admin/posts"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Create Post
          </Link>
        </div>
      </div>
    </div>
  );
}