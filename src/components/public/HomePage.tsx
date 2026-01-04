'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Profile {
  id: string;
  bio: string | null;
  xLink: string | null;
  instagramLink: string | null;
  linkedinLink: string | null;
}

interface Subsection {
  id: string;
  name: string;
  slug: string;
  icon: string;
  postCount: number;
}

interface TopCategory {
  id: string;
  name: string;
  isVisible: boolean;
  subsections: Subsection[];
}

export function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sections, setSections] = useState<TopCategory[]>([]);
  const [adminName, setAdminName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, sectionsRes, adminRes] = await Promise.all([
          fetch('/api/public/profile'),
          fetch('/api/admin/sections', { credentials: 'include' }),
          fetch('/api/public/admin')
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.profile);
        }

        if (sectionsRes.ok) {
          const sectionsData = await sectionsRes.json();
          setSections(sectionsData.sections.filter((s: TopCategory) => s.isVisible));
        }

        if (adminRes.ok) {
          const adminData = await adminRes.json();
          setAdminName(adminData.name);
        }
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
      <div className="min-h-screen bg-[#101011] flex items-center justify-center">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101011]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-48 bg-[#090909] min-h-screen fixed left-0 top-0">
          <div className="p-6">
            {/* Admin Name */}
            <div className="mb-12">
              <Link href="/" className="text-white text-[15px] font-normal hover:opacity-70 transition">
                {adminName}
              </Link>
            </div>

            {/* Navigation */}
            <nav className="space-y-8">
              {/* Home Link */}
              <div>
                <Link 
                  href="/" 
                  className="text-[13px] text-neutral-500 hover:text-white transition block"
                >
                  Home
                </Link>
              </div>

              {/* Sections and Subsections */}
              {sections.map((section) => (
                <div key={section.id}>
                  <h2 className="text-[13px] text-neutral-600 mb-3 font-normal">
                    {section.name}
                  </h2>
                  <ul className="space-y-2.5">
                    {section.subsections.map((subsection) => (
                      <li key={subsection.id}>
                        <Link
                          href={`/${subsection.slug}`}
                          className="text-[13px] text-neutral-500 hover:text-white transition flex items-center gap-2 group"
                        >
                          <span className="opacity-50 group-hover:opacity-100 transition">
                            {subsection.icon}
                          </span>
                          <span>{subsection.name}</span>
                          {subsection.postCount > 0 && (
                            <span className="text-[11px] text-neutral-600 ml-auto">
                              {subsection.postCount}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Social Links at Bottom */}
          {profile && (profile.xLink || profile.linkedinLink || profile.instagramLink) && (
            <div className="absolute bottom-6 left-6">
              <div className="flex gap-4">
                {profile.xLink && (
                  <a
                    href={profile.xLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-white transition"
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
                    className="text-neutral-600 hover:text-white transition"
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
                    className="text-neutral-600 hover:text-white transition"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content - Centered with shadow effect */}
        <main className="ml-48 flex-1 flex items-start justify-center p-12">
          <div className="w-full max-w-3xl">
            {/* Floating Card with Shadow */}
            <div className="bg-[#090909] rounded-3xl p-12 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
              {/* Bio */}
              {profile?.bio && (
                <div className="mb-8">
                  <p className="text-neutral-300 text-[15px] leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Social Links */}
              {profile && (profile.xLink || profile.linkedinLink || profile.instagramLink) && (
                <div className="flex gap-4">
                  {profile.xLink && (
                    <a
                      href={profile.xLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 hover:text-white transition"
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
                      className="text-neutral-600 hover:text-white transition"
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
                      className="text-neutral-600 hover:text-white transition"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}

              {!profile?.bio && (
                <div className="text-neutral-500 text-[14px]">
                  <p>Welcome! Configure your profile in the admin panel.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}