'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Text */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-[80px] sm:text-[120px] font-light text-white leading-none mb-2">
            404
          </h1>
          <div className="h-px bg-linear-to-r from-transparent via-neutral-700 to-transparent mb-4 sm:mb-6"></div>
          <p className="text-lg sm:text-xl text-neutral-400 mb-2">Page not found</p>
          <p className="text-xs sm:text-sm text-neutral-600 px-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-white text-[#0a0a0a] rounded-lg hover:opacity-90 transition text-sm font-medium touch-manipulation"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition text-sm font-medium touch-manipulation"
          >
            Go Back
          </button>
        </div>

        {/* Decorative Element */}
        <div className="mt-8 sm:mt-12 flex justify-center gap-1">
          <div className="w-2 h-2 rounded-full bg-neutral-800 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-neutral-800 animate-pulse" style={{ animationDelay: '75ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-neutral-800 animate-pulse" style={{ animationDelay: '150ms' }}></div>
        </div>
      </div>
    </div>
  );
}