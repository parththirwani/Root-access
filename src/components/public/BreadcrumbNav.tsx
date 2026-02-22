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
    <nav className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 gap-2">
      {/* Breadcrumb trail */}
      <div className="flex items-center gap-1.5 text-xs sm:text-[13px] min-w-0 flex-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 min-w-0">
            {item.href ? (
              <Link
                href={item.href}
                className="text-neutral-500 hover:text-white transition shrink-0 max-w-20 sm:max-w-50 truncate"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-400 truncate min-w-0">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <span className="text-neutral-700 shrink-0">›</span>
            )}
          </div>
        ))}
      </div>

      {/* Invisible spacer matching the fixed hamburger button size (w-10 h-10),
          only shown on mobile so breadcrumb text never slides underneath it */}
      <div className="w-10 shrink-0 md:hidden" aria-hidden="true" />
    </nav>
  );
}