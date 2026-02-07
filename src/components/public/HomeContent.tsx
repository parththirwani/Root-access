'use client';

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
  topCategory: {
    name: string;
  };
}

interface HomeContentProps {
  profile: Profile | null;
  subsections: Subsection[];
}

export function HomeContent({ profile, subsections }: HomeContentProps) {
  // Group subsections by category
  const subsectionsByCategory = subsections.reduce((acc, sub) => {
    const category = sub.topCategory.name;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(sub);
    return acc;
  }, {} as Record<string, Subsection[]>);

  const categories = Object.keys(subsectionsByCategory).sort();

  return (
    <div className="w-full max-w-3xl">
      <div className="bg-[#101010] rounded-3xl p-8 md:p-12 border border-black">
        {/* Bio Section */}
        {profile?.bio ? (
          <div className="mb-12">
            <div className="prose prose-invert prose-neutral max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Customize markdown rendering
                  p: ({ children }) => (
                    <p className="text-neutral-300 text-[15px] leading-relaxed mb-4 last:mb-0">
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-white text-2xl font-medium mb-4">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-white text-xl font-medium mb-3">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-white text-lg font-medium mb-3">
                      {children}
                    </h3>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-white font-medium">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-neutral-400 italic">{children}</em>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-neutral-400 hover:text-white underline transition"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-neutral-300 text-[15px] space-y-2 mb-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-neutral-300 text-[15px] space-y-2 mb-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="bg-[#1a1a1a] text-neutral-300 px-1.5 py-0.5 rounded text-[14px] font-mono">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className="block bg-[#1a1a1a] text-neutral-300 p-4 rounded text-[14px] font-mono overflow-x-auto mb-4">
                        {children}
                      </code>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-neutral-700 pl-4 italic text-neutral-400 mb-4">
                      {children}
                    </blockquote>
                  ),
                  hr: () => (
                    <hr className="border-t border-neutral-800 my-8" />
                  ),
                }}
              >
                {profile.bio}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="text-neutral-500 text-[14px] mb-12">
            <p>Welcome! Configure your profile in the admin panel.</p>
          </div>
        )}

        {/* Quick Links Section */}
        {subsections.length > 0 && (
          <div className="border-t border-neutral-900 pt-8">
            <h2 className="text-white text-lg font-medium mb-6">
              Quick Links
            </h2>

            {/* If only one category, show flat list */}
            {categories.length === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subsections.map((subsection) => (
                  <Link
                    key={subsection.id}
                    href={`/${subsection.slug}`}
                    className="group block"
                  >
                    <div className="bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-neutral-900 hover:border-neutral-800 rounded-xl p-4 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl opacity-60 group-hover:opacity-80 transition grayscale">
                          {subsection.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-neutral-300 group-hover:text-white text-[15px] font-normal transition">
                            {subsection.name}
                          </h3>
                          {subsection.postCount > 0 && (
                            <p className="text-neutral-600 text-[13px]">
                              {subsection.postCount}{' '}
                              {subsection.postCount === 1 ? 'post' : 'posts'}
                            </p>
                          )}
                        </div>
                        <svg
                          className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition opacity-0 group-hover:opacity-100"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* Multiple categories - show grouped */
              <div className="space-y-8">
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className="text-neutral-500 text-[13px] uppercase tracking-wider mb-3">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {subsectionsByCategory[category].map((subsection) => (
                        <Link
                          key={subsection.id}
                          href={`/${subsection.slug}`}
                          className="group block"
                        >
                          <div className="bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-neutral-900 hover:border-neutral-800 rounded-xl p-4 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl opacity-60 group-hover:opacity-80 transition grayscale">
                                {subsection.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-neutral-300 group-hover:text-white text-[15px] font-normal transition">
                                  {subsection.name}
                                </h4>
                                {subsection.postCount > 0 && (
                                  <p className="text-neutral-600 text-[13px]">
                                    {subsection.postCount}{' '}
                                    {subsection.postCount === 1
                                      ? 'post'
                                      : 'posts'}
                                  </p>
                                )}
                              </div>
                              <svg
                                className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition opacity-0 group-hover:opacity-100"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}