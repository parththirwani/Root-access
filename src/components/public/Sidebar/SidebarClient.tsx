'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArticleIcon, LightbulbIcon, NewspaperIcon, QuotesIcon, BookOpenIcon, FileTextIcon, LinkSimpleIcon, ListIcon, XIcon } from '@phosphor-icons/react';
import { SocialLinks } from '../SocialLinks';
import { orderSections } from '@/src/lib/siteOrder';
import { ThemeToggleButton } from '@/src/components/spaceui/theme-toggle';

interface LayoutData {
  admin: {
    name: string;
    profile: {
      xLink: string | null;
      instagramLink: string | null;
      linkedinLink: string | null;
      githubLink: string | null;
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

const navigationIcons: Record<string, typeof ArticleIcon> = {
  writing: ArticleIcon,
  projects: LightbulbIcon,
  publications: NewspaperIcon,
  quotes: QuotesIcon,
  books: BookOpenIcon,
};

export function SidebarClient({ layoutData }: { layoutData: LayoutData }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 851px)');
    const dismissOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener('pointerdown', dismissOutside);
    document.addEventListener('keydown', dismissOnEscape);
    desktop.addEventListener('change', dismissOnDesktop);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      document.removeEventListener('keydown', dismissOnEscape);
      desktop.removeEventListener('change', dismissOnDesktop);
    };
  }, [menuOpen]);
  const profile = layoutData.admin.profile;
  const avatarSrc = profile?.profilePicture?.startsWith('https://res.cloudinary.com/')
    ? profile.profilePicture.replace('/image/upload/', '/image/upload/f_auto,q_auto,c_fill,w_96,h_96/')
    : profile?.profilePicture;
  const links = orderSections(layoutData.sections.flatMap((section) => section.subsections));

  return (
    <header className="site-header" ref={headerRef}>
      <div className="site-header-inner">
        <Link href="/" onClick={() => setMenuOpen(false)} className="site-brand" aria-label={`${layoutData.admin.name}, home`}>
          {avatarSrc && <Image src={avatarSrc} alt="" width={36} height={36} unoptimized />}
          <span>{layoutData.admin.name}</span>
        </Link>

        <button ref={menuButtonRef} className="site-menu-button" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <XIcon size={21} aria-hidden="true" /> : <ListIcon size={21} aria-hidden="true" />}
        </button>

        <nav id="site-navigation" className={`site-navigation ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation" onClick={(event) => {
          if ((event.target as HTMLElement).closest('a')) setMenuOpen(false);
        }}>
          <Link href="/" className="site-nav-home" aria-current={pathname === '/' ? 'page' : undefined}>Home</Link>
          {links.map((link) => {
            const Icon = navigationIcons[link.slug] ?? LinkSimpleIcon;
            return <Link key={link.id} href={`/${link.slug}`} aria-label={link.name} title={link.name} aria-current={pathname === `/${link.slug}` || pathname.startsWith(`/${link.slug}/`) ? 'page' : undefined}>
              <Icon className="site-nav-icon" size={19} aria-hidden="true" />
              <span className="site-nav-label">{link.name}</span>
            </Link>;
          })}
          {profile?.resumeUrl && <a href={profile.resumeUrl} aria-label="Resume" title="Resume" target="_blank" rel="noopener noreferrer">
            <FileTextIcon className="site-nav-icon" size={19} aria-hidden="true" />
            <span className="site-nav-label">Resume <span aria-hidden="true">↗</span></span>
          </a>}
          {profile && <div className="site-desktop-socials"><SocialLinks profile={profile} compact /></div>}
          <ThemeToggleButton className="site-theme-button" buttonVariant="ghost" size="md" title="Toggle color scheme" />
          {profile && <div className="site-mobile-socials"><SocialLinks profile={profile} compact /></div>}
        </nav>
      </div>
    </header>
  );
}
