'use client';

import { useState } from 'react';

interface Post {
  title: string;
  description: string;
  content: string;
  publishedAt: string | null;
  coverImage: string | null;
  views: number;
}

export function PostContent({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false);

  const handleCopyPage = async () => {
    const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';
    await navigator.clipboard.writeText(`${post.title}\n${date}\n\n${post.content.replace(/<[^>]*>/g, '')}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="site-article">
      <header className="article-header">
        {post.publishedAt && <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>}
        <h1 className="site-title">{post.title}</h1>
        {post.description && <p className="article-description">{post.description}</p>}
      </header>
      {post.coverImage && <img className="article-cover" src={post.coverImage} alt={post.title} />}
      <div className="site-prose article-body" dangerouslySetInnerHTML={{ __html: post.content }} />
      <footer className="article-footer">
        <button type="button" onClick={handleCopyPage}>{copied ? 'Copied' : 'Copy page'}</button>
        <span>{post.views.toLocaleString()} views</span>
      </footer>
    </article>
  );
}
