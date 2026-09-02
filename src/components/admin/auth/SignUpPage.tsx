'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FullScreenLoader, Spinner } from '../../ui/Spinner';

export function AdminSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    secretKey: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  // Check if signup is allowed on component mount
  useEffect(() => {
    async function checkSignupEligibility() {
      try {
        const response = await fetch('/api/admin/check-signup');
        const data = await response.json();
        
        if (!data.allowSignup) {
          // Redirect to login if an admin already exists
          router.push('/admin/login');
          return;
        }
      } catch (error) {
        console.error('Failed to check signup eligibility:', error);
        setError('Unable to verify signup eligibility. Please try again.');
        // Still allow the form to show - API will validate on submit
      } finally {
        setCheckingEligibility(false);
      }
    }

    checkSignupEligibility();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Redirect to login after successful signup
      router.push('/admin/login');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking eligibility
  if (checkingEligibility) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-[28px] font-normal text-white mb-6 sm:mb-8 text-center">
          Admin Signup
        </h1>

        <form onSubmit={handleSubmit} className="bg-[#0a0a0a] p-6 sm:p-8 rounded-lg border border-[#1a1a1a]">
          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded text-xs sm:text-[13px] text-red-400 wrap-break-word">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block text-xs sm:text-[13px] font-medium text-[#e5e5e5] mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="John Doe"
              className="w-full px-4 py-2 sm:py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-sm sm:text-[14px] focus:outline-none focus:border-white transition"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-xs sm:text-[13px] font-medium text-[#e5e5e5] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="admin@example.com"
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
              value={formData.secretKey}
              onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
              required
              placeholder="Create a strong password"
              className="w-full px-4 py-2 sm:py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-sm sm:text-[14px] focus:outline-none focus:border-white transition"
            />
            <p className="text-xs text-[#707070] mt-2">
              This will be your admin password. Keep it secure.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#0a0a0a] py-2 sm:py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-[14px] font-medium mb-4 touch-manipulation"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Spinner size="sm" className="border-white/40 border-t-[#0a0a0a]" /> Sign Up
              </span>
            ) : (
              'Sign Up'
            )}
          </button>

          <p className="text-center text-xs sm:text-[13px] text-[#707070]">
            Already have an account?{' '}
            <Link href="/admin/login" className="text-white hover:opacity-70 transition">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}