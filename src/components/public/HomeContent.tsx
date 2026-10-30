import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Profile {
  id: string;
  bio: string | null;
  xLink: string | null;
  instagramLink: string | null;
  linkedinLink: string | null;
  email: string | null;
  resumeUrl: string | null;
  profilePicture: string | null;
}

interface Subsection {
  id: string;
  name: string;
  slug: string;
  icon: string;
  postCount: number;
  topCategory: { name: string };
}

export function HomeContent({ profile, subsections, name }: { profile: Profile | null; subsections: Subsection[]; name: string }) {
  const groups = subsections.reduce((acc, subsection) => {
    (acc[subsection.topCategory.name] ??= []).push(subsection);
    return acc;
  }, {} as Record<string, Subsection[]>);

  return (
    <div className="site-container home-page">
      <h1 className="site-title">{name}</h1>
      <div className="site-prose home-bio">
        {profile?.bio ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{profile.bio}</ReactMarkdown> : <p>Welcome! Configure your profile in the admin panel.</p>}
      </div>

      {subsections.length > 0 && (
        <section className="home-index" aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="site-section-heading">Explore</h2>
          {Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).map(([category, items]) => (
            <div className="home-index-group" key={category}>
              <h3>{category}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    <Link href={`/${item.slug}`}>
                      <span>{item.name}</span>
                      <span className="home-index-count">{item.postCount} {item.postCount === 1 ? 'post' : 'posts'}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {profile && (profile.email || profile.xLink || profile.linkedinLink || profile.instagramLink) && (
        <section className="home-contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="site-section-heading">Find me on</h2>
          <div className="home-contact-links">
            {profile.email && <a href={`mailto:${profile.email}`}>Email</a>}
            {profile.xLink && <a href={profile.xLink} target="_blank" rel="noopener noreferrer">X</a>}
            {profile.linkedinLink && <a href={profile.linkedinLink} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {profile.instagramLink && <a href={profile.instagramLink} target="_blank" rel="noopener noreferrer">Instagram</a>}
          </div>
        </section>
      )}
    </div>
  );
}
