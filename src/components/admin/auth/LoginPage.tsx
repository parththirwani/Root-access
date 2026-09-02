'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/src/lib/api';
import { useAuth } from '@/src/contexts/authContext';
import { FullScreenLoader, Spinner } from '../../ui/Spinner';

export function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminApi.login({ email, secretKey });
      await checkAuth();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-[28px] font-normal text-white mb-6 sm:mb-8 text-center">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="bg-[#0a0a0a] p-6 sm:p-8 rounded-lg border border-[#1a1a1a]">
          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded text-xs sm:text-[13px] text-red-400 wrap-break-word">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-xs sm:text-[13px] font-medium text-[#e5e5e5] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 sm:py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-sm sm:text-[14px] focus:outline-none focus:border-white transition"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="secretKey" className="block text-xs sm:text-[13px] font-medium text-[#e5e5e5] mb-2">
              Secret Key
            </label>
            <input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
              className="w-full px-4 py-2 sm:py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-sm sm:text-[14px] focus:outline-none focus:border-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#0a0a0a] py-2 sm:py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-[14px] font-medium mb-4 touch-manipulation"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Spinner size="sm" className="border-white/40 border-t-[#0a0a0a]" /> Login
              </span>
            ) : (
              'Login'
            )}
          </button>

          <p className="text-center text-xs sm:text-[13px] text-[#707070]">
            Don't have an account?{' '}
            <Link href="/admin/signup" className="text-white hover:opacity-70 transition">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}