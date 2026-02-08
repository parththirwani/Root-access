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
    <div className="w-full max-w-3xl px-4 sm:px-0">
      <div className="bg-[#101010] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-black">
        {/* Bio Section */}
        {profile?.bio ? (
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className="prose prose-invert prose-neutral max-w-none prose-sm sm:prose-base">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Customize markdown rendering for responsiveness with justified text
                  p: ({ children }) => (
                    <p className="text-neutral-300 text-sm sm:text-[15px] leading-relaxed mb-4 last:mb-0 wrap-break-word text-justify">
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-white text-xl sm:text-2xl font-medium mb-4 wrap-break-word">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-white text-lg sm:text-xl font-medium mb-3 wrap-break-word">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-white text-base sm:text-lg font-medium mb-3 wrap-break-word">
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
                      className="text-neutral-400 hover:text-white underline transition wrap-break-word"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-neutral-300 text-sm sm:text-[15px] space-y-2 mb-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-neutral-300 text-sm sm:text-[15px] space-y-2 mb-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed wrap-break-word text-justify">{children}</li>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="bg-[#1a1a1a] text-neutral-300 px-1.5 py-0.5 rounded text-xs sm:text-[14px] font-mono break-all">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className="block bg-[#1a1a1a] text-neutral-300 p-3 sm:p-4 rounded text-xs sm:text-[14px] font-mono overflow-x-auto mb-4">
                        {children}
                      </code>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-neutral-700 pl-3 sm:pl-4 italic text-neutral-400 mb-4 wrap-break-word text-justify">
                      {children}
                    </blockquote>
                  ),
                  hr: () => (
                    <hr className="border-t border-neutral-800 my-6 sm:my-8" />
                  ),
                }}
              >
                {profile.bio}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="text-neutral-500 text-sm mb-8 sm:mb-10 md:mb-12">
            <p>Welcome! Configure your profile in the admin panel.</p>
          </div>
        )}

        {/* Quick Links Section */}
        {subsections.length > 0 && (
          <div className="border-t border-neutral-900 pt-6 sm:pt-8">
            <h2 className="text-white text-base sm:text-lg font-medium mb-4 sm:mb-6">
              Quick Links
            </h2>

            {/* If only one category, show flat list */}
            {categories.length === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {subsections.map((subsection) => (
                  <Link
                    key={subsection.id}
                    href={`/${subsection.slug}`}
                    className="group block"
                  >
                    <div className="bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-neutral-900 hover:border-neutral-800 rounded-xl p-3 sm:p-4 transition-all duration-200">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl opacity-60 group-hover:opacity-80 transition grayscale shrink-0">
                          {subsection.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-neutral-300 group-hover:text-white text-sm sm:text-[15px] font-normal transition truncate">
                            {subsection.name}
                          </h3>
                          {subsection.postCount > 0 && (
                            <p className="text-neutral-600 text-xs sm:text-[13px]">
                              {subsection.postCount}{' '}
                              {subsection.postCount === 1 ? 'post' : 'posts'}
                            </p>
                          )}
                        </div>
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-600 group-hover:text-neutral-400 transition opacity-0 group-hover:opacity-100 shrink-0"
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
              <div className="space-y-6 sm:space-y-8">
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className="text-neutral-500 text-xs sm:text-[13px] uppercase tracking-wider mb-2 sm:mb-3">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {subsectionsByCategory[category].map((subsection) => (
                        <Link
                          key={subsection.id}
                          href={`/${subsection.slug}`}
                          className="group block"
                        >
                          <div className="bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-neutral-900 hover:border-neutral-800 rounded-xl p-3 sm:p-4 transition-all duration-200">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <span className="text-xl sm:text-2xl opacity-60 group-hover:opacity-80 transition grayscale shrink-0">
                                {subsection.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-neutral-300 group-hover:text-white text-sm sm:text-[15px] font-normal transition truncate">
                                  {subsection.name}
                                </h4>
                                {subsection.postCount > 0 && (
                                  <p className="text-neutral-600 text-xs sm:text-[13px]">
                                    {subsection.postCount}{' '}
                                    {subsection.postCount === 1
                                      ? 'post'
                                      : 'posts'}
                                  </p>
                                )}
                              </div>
                              <svg
                                className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-600 group-hover:text-neutral-400 transition opacity-0 group-hover:opacity-100 shrink-0"
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