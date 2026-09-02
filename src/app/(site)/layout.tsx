import { Suspense } from 'react';
import { PublicSidebarServer } from '@/src/components/public/Sidebar/SidebarServer';

export const revalidate = 60;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<SidebarSkeleton />}>
        <PublicSidebarServer />
      </Suspense>
      {children}
    </>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="hidden md:block w-48 bg-[#0a0a0a] min-h-screen fixed left-0 top-0">
      <div className="p-6 animate-pulse">
        <div className="h-5 bg-neutral-800 rounded mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-neutral-800 rounded"></div>
          <div className="h-4 bg-neutral-800 rounded"></div>
          <div className="h-4 bg-neutral-800 rounded"></div>
        </div>
      </div>
    </aside>
  );
}
