'use client';

import Link from 'next/link';

interface BreadcrumbNavProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav className="sticky top-0 z-10 border-b border-black px-4 sm:px-6 md:px-12 lg:px-20 py-2 sm:py-3 bg-[#101010]">
      <div className="flex items-center gap-2 text-xs sm:text-[13px] overflow-x-auto scrollbar-hide">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 shrink-0">
            {item.href ? (
              <Link 
                href={item.href}
                className="text-neutral-500 hover:text-white transition truncate max-w-37.5 sm:max-w-none"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-400 truncate max-w-50 sm:max-w-none">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <span className="text-neutral-700 shrink-0">›</span>
            )}
          </div>
        ))}
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
}