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
    if (pathname === '/admin/login' || pathname === '/admin/signup') {
      return;
    }

    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
      await checkAuth();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-[#707070]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/sections', label: 'Sections', icon: '📁' },
    { href: '/admin/subsections', label: 'Subsections', icon: '📂' },
    { href: '/admin/posts', label: 'Posts', icon: '📝' },
    { href: '/admin/tags', label: 'Tags', icon: '🏷️' },
    { href: '/admin/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-48 bg-[#0a0a0a] min-h-screen fixed left-0 top-0 border-r border-[#1a1a1a]">
        <div className="p-6">
          {/* Admin Header */}
          <div className="mb-8">
            <Link href="/admin" className="flex items-center gap-2 hover:opacity-70 transition">
              <div className="w-5 h-5 rounded-full bg-neutral-700 flex items-center justify-center">
                <span className="text-[10px]">⚙️</span>
              </div>
              <span className="text-white text-[14px] font-normal">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition ${
                    isActive
                      ? 'bg-[#1a1a1a] text-white'
                      : 'text-[#707070] hover:text-white hover:bg-[#1a1a1a]'
                  }`}
                >
                  <span className="opacity-60">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[#707070] hover:text-white hover:bg-[#1a1a1a] transition"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-48 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}