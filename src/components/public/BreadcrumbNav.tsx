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
    <nav className="sticky top-0 z-10 border-b border-black px-20 py-3 bg-[#101010]">
      <div className="flex items-center gap-2 text-[13px]">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link 
                href={item.href}
                className="text-neutral-500 hover:text-white transition"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-400">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="text-neutral-700">›</span>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}