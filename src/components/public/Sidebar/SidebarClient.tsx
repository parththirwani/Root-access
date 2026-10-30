'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutData {
  admin: {
    name: string;
    profile: {
      xLink: string | null;
      instagramLink: string | null;
      linkedinLink: string | null;
      email: string | null;
      resumeUrl: string | null;
      profilePicture: string | null;
    } | null;
  };
  sections: Array<{
    id: string;
    name: string;
    isVisible: boolean;
    subsections: Array<{ id: string; name: string; slug: string; icon: string; postCount: number }>;
  }>;
}

export function SidebarClient({ layoutData }: { layoutData: LayoutData }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('site-theme');
    const preferred = saved ? saved === 'dark' : true;
    document.querySelector('.site-shell')?.classList.toggle('dark', preferred);
  }, []);

  const toggleTheme = () => {
    const next = !document.querySelector('.site-shell')?.classList.contains('dark');
    localStorage.setItem('site-theme', next ? 'dark' : 'light');
    document.querySelector('.site-shell')?.classList.toggle('dark', next);
  };

  const profile = layoutData.admin.profile;
  const links = layoutData.sections.flatMap((section) => section.subsections);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand" aria-label={`${layoutData.admin.name}, home`}>
          {profile?.profilePicture && <img src={profile.profilePicture} alt="" width="36" height="36" />}
          <span>{layoutData.admin.name}</span>
        </Link>

        <button className="site-menu-button" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <nav id="site-navigation" className={`site-navigation ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <Link href="/" onClick={() => setMenuOpen(false)} aria-current={pathname === '/' ? 'page' : undefined}>Home</Link>
          {links.map((link) => (
            <Link key={link.id} href={`/${link.slug}`} onClick={() => setMenuOpen(false)} aria-current={pathname === `/${link.slug}` || pathname.startsWith(`/${link.slug}/`) ? 'page' : undefined}>{link.name}</Link>
          ))}
          {profile?.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">Resume <span aria-hidden="true">↗</span></a>}
          <button className="site-theme-button" type="button" onClick={toggleTheme} aria-label="Toggle color scheme" title="Toggle color scheme">
            ◐
          </button>
          <div className="site-mobile-socials">
            {profile?.email && <a href={`mailto:${profile.email}`}>Email</a>}
            {profile?.xLink && <a href={profile.xLink} target="_blank" rel="noopener noreferrer">X</a>}
            {profile?.linkedinLink && <a href={profile.linkedinLink} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {profile?.instagramLink && <a href={profile.instagramLink} target="_blank" rel="noopener noreferrer">Instagram</a>}
          </div>
        </nav>
      </div>
    </header>
  );
}
