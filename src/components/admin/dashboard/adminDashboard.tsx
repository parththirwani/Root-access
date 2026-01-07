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

        const sections = (sectionsResponse as any).sections;
        let totalPosts = 0;
        let subsectionCount = 0;

        sections.forEach((section: any) => {
          if (section.subsections) {
            subsectionCount += section.subsections.length;
            section.subsections.forEach((sub: any) => {
              totalPosts += sub.postCount || 0;
            });
          }
        });

        setStats({
          sections: sections.length,
          subsections: subsectionCount,
          posts: totalPosts,
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
    { label: 'Sections', value: stats.sections, href: '/admin/sections', icon: '📁' },
    { label: 'Subsections', value: stats.subsections, href: '/admin/subsections', icon: '📂' },
    { label: 'Posts', value: stats.posts, href: '/admin/posts', icon: '📝' },
    { label: 'Tags', value: stats.tags, href: '/admin/tags', icon: '🏷️' },
  ];

  if (loading) {
    return (
      <div className="text-[#707070] text-[14px]">Loading dashboard...</div>
    );
  }

  return (
    <div>
      <h1 className="text-[28px] font-normal text-white mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-[#101010] p-6 rounded-xl border border-[#1a1a1a] hover:border-[#2a2a2a] transition group"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl opacity-60 group-hover:opacity-80 transition">
                {card.icon}
              </span>
              <div className="text-[13px] text-[#707070] group-hover:text-[#e5e5e5] transition">
                {card.label}
              </div>
            </div>
            <div className="text-3xl font-light text-white">
              {card.value}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#101010] p-6 rounded-xl border border-[#1a1a1a]">
        <h2 className="text-[18px] font-normal text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/sections"
            className="px-4 py-2 bg-white text-[#0a0a0a] rounded-lg hover:opacity-90 transition text-[13px] font-medium"
          >
            Create Section
          </Link>
          <Link
            href="/admin/subsections"
            className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition text-[13px] font-medium"
          >
            Create Subsection
          </Link>
          <Link
            href="/admin/posts"
            className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition text-[13px] font-medium"
          >
            Create Post
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition text-[13px] font-medium"
          >
            View Site →
          </Link>
        </div>
      </div>
    </div>
  );
}