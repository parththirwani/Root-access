'use client';

import { useEffect, useState } from 'react';
import { PublicSidebar } from './Sidebar';


interface Profile {
  id: string;
  bio: string | null;
  xLink: string | null;
  instagramLink: string | null;
  linkedinLink: string | null;
}

export function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const profileRes = await fetch('/api/public/profile');

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.profile);
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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="flex">
        {/* Sidebar */}
        <PublicSidebar />

        {/* Main Content - Centered with shadow effect */}
        <main className="ml-48 flex-1 flex items-start justify-center p-12">
          <div className="w-full max-w-3xl">
            {/* Floating Card with Shadow */}
            <div className="bg-[#101010] rounded-3xl p-12 border border-black">
              {/* Bio */}
              {profile?.bio && (
                <div className="mb-8">
                  <p className="text-neutral-300 text-[15px] leading-relaxed">
                    {profile.bio}
                  </p>
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