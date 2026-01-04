'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { adminApi } from '@/src/lib/api';
import { useAuth } from '@/src/contexts/authContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    // Don't redirect from login/signup pages
    if (pathname === '/admin/login' || pathname === '/admin/signup') {
      return;
    }

    // Only redirect if not loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
      await checkAuth(); // Update auth state
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-[#707070]">Loading...</div>
      </div>
    );
  }

  // Don't render admin content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/sections', label: 'Sections' },
    { href: '/admin/subsections', label: 'Subsections' },
    { href: '/admin/posts', label: 'Posts' },
    { href: '/admin/tags', label: 'Tags' },
    { href: '/admin/profile', label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-[15px] font-medium text-white">
                Admin
              </Link>
              <div className="flex gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-[13px] ${
                      pathname === item.href
                        ? 'text-white'
                        : 'text-[#707070] hover:text-white'
                    } transition`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-[13px] text-[#707070] hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}