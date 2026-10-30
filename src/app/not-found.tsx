'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main-content" className="site-container not-found-page">
      <p className="archive-kicker">404</p>
      <h1 className="site-title">Page not found</h1>
      <p>The page you’re looking for doesn’t exist or has moved.</p>
      <div className="not-found-actions">
        <Link href="/">Go home</Link>
        <button type="button" onClick={() => window.history.back()}>Go back</button>
      </div>
    </main>
  );
}
