'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/src/lib/api';
import { useAuth } from '@/src/contexts/authContext';

export function AdminLoginPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminApi.login({ email, secretKey });
      // Update auth state before redirecting
      await checkAuth();
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-full max-w-md px-6">
        <h1 className="text-[28px] font-normal text-white mb-8 text-center">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="bg-[#0a0a0a] p-8 rounded-lg border border-[#1a1a1a]">
          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded text-[13px] text-red-400">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="secretKey" className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
              Secret Key
            </label>
            <input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#0a0a0a] py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 text-[14px] font-medium mb-4"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-[13px] text-[#707070]">
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