'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Profile, Subsection } from '@/src/types';
import { publicApi } from '@/src/lib/api';


export function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, subsectionsRes] = await Promise.all([
          publicApi.getProfile(),
          publicApi.getSubsections(),
        ]);
        setProfile((profileRes as { profile: Profile }).profile);
        setSubsections((subsectionsRes as { subsections: Subsection[] }).subsections);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Profile Section */}
        <header className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hello! I'm Shlok.
          </h1>
          
          {profile?.bio && (
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {profile.bio}
            </p>
          )}

          {/* Social Links */}
          <div className="flex gap-4 text-sm">
            {profile?.xLink && (
              <a
                href={profile.xLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                X
              </a>
            )}
            {profile?.linkedinLink && (
              <a
                href={profile.linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                LinkedIn
              </a>
            )}
            {profile?.instagramLink && (
              <a
                href={profile.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Instagram
              </a>
            )}
          </div>
        </header>

        {/* Subsections Grid */}
        {subsections.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Explore
            </h2>
            <div className="grid gap-4">
              {subsections.map((subsection) => (
                <Link
                  key={subsection.id}
                  href={`/${subsection.slug}`}
                  className="group p-6 border border-gray-200 rounded-lg hover:border-gray-900 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{subsection.icon}</span>
                        <h3 className="text-xl font-medium text-gray-900 group-hover:underline">
                          {subsection.name}
                        </h3>
                      </div>
                      {subsection.topCategory && (
                        <p className="text-sm text-gray-500">
                          {subsection.topCategory.name}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {subsection.postCount} {subsection.postCount === 1 ? 'post' : 'posts'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}