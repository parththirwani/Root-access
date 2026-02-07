'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminApi } from '@/src/lib/api';
import { useAuth } from '@/src/contexts/authContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#101010] border border-[#1a1a1a] rounded-lg flex items-center justify-center text-white"
      >
        {mobileMenuOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 md:w-48 bg-[#0a0a0a] min-h-screen border-r border-[#1a1a1a]
        md:fixed md:left-0 md:top-0
        fixed left-0 top-0 z-40 transform transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 md:p-6">
          {/* Admin Header */}
          <div className="mb-6 md:mb-8">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 hover:opacity-70 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
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
                  onClick={() => setMobileMenuOpen(false)}
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
          <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
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
      <main className="md:ml-48 min-h-screen">
        <div className="p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}