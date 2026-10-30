'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  title: string;
  slug: string;
  publishedAt: string | null;
  excerpt: string | null;
  description: string;
  coverImage: string | null;
  projectLink: string | null;
  tags: Array<{ name: string }>;
}

interface Subsection {
  name: string;
  displayStyle: string;
  posts?: Post[];
  topCategory?: { name: string };
}

export function SubsectionContent({ subsection, slug }: { subsection: Subsection; slug: string }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const posts = subsection.posts ?? [];
  const tags = ['All', ...Array.from(new Set(posts.flatMap((post) => post.tags.map((tag) => tag.name))))];
  const filtered = posts
    .filter((post) => activeFilter === 'All' || post.tags.some((tag) => tag.name === activeFilter))
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());
  const years = Array.from(new Set(filtered.map((post) => post.publishedAt ? new Date(post.publishedAt).getFullYear() : 'Undated')));
  const isProject = subsection.displayStyle === 'PROJECT';
  const titleOnly = subsection.displayStyle === 'TITLE_ONLY';

  const renderPost = (post: Post) => {
    const href = isProject && post.projectLink ? post.projectLink : `/${slug}/${post.slug}`;
    const external = isProject && !!post.projectLink;
    const body = (
      <>
        {isProject && post.coverImage && <Image className="project-cover" src={post.coverImage} alt="" width={640} height={400} unoptimized loading="lazy" />}
        <span className="archive-post-content">
          <span className="archive-post-title">{post.title}{external && <span className="external-mark" aria-label="external link"> ↗</span>}</span>
          {!titleOnly && (post.description || post.excerpt) && <span className="archive-post-description">{post.description || post.excerpt}</span>}
          {isProject && post.tags.length > 0 && <span className="archive-post-tags">{post.tags.map((tag) => tag.name).join(' · ')}</span>}
        </span>
        {!isProject && <time className="archive-post-date" dateTime={post.publishedAt ?? undefined}>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</time>}
      </>
    );
    return <li key={post.slug} className={isProject ? 'project-item' : 'archive-post'}><Link href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{body}</Link></li>;
  };

  return (
    <main id="main-content" className="site-container archive-page">
      <div className="archive-heading">
        {subsection.topCategory && <p className="archive-kicker">{subsection.topCategory.name}</p>}
        <h1 className="site-title">{subsection.name}</h1>
        <p className="archive-summary">{posts.length} {posts.length === 1 ? 'entry' : 'entries'}</p>
      </div>
      {tags.length > 1 && (
        <div className="archive-filters" role="group" aria-label="Filter by tag">
          {tags.map((tag) => <button key={tag} type="button" onClick={() => setActiveFilter(tag)} aria-pressed={activeFilter === tag}>{tag}</button>)}
        </div>
      )}
      {filtered.length === 0 && <p className="archive-empty">No posts yet.</p>}
      {isProject ? <ul className="project-grid">{filtered.map(renderPost)}</ul> : years.map((year) => (
        <section className="archive-year" key={year} aria-labelledby={`year-${year}`}>
          <h2 id={`year-${year}`}>{year}</h2>
          <ul>{filtered.filter((post) => (post.publishedAt ? new Date(post.publishedAt).getFullYear() : 'Undated') === year).map(renderPost)}</ul>
        </section>
      ))}
    </main>
  );
}
