import { Suspense } from 'react';
import { prisma } from '@/src/lib/prisma';
import { PublicSidebarServer } from '../components/public/Sidebar/SidebarServer';
import { HomeContent } from '../components/public/HomeContent';

export const revalidate = 60;

async function getHomeData() {
  const admin = await prisma.admin.findFirst({
    select: {
      name: true,
      profile: {
        select: {
          id: true,
          bio: true,
          xLink: true,
          instagramLink: true,
          linkedinLink: true,
          email: true,
          resumeUrl: true,
          profilePicture: true,
        },
      },
    },
  });

  const subsections = await prisma.subsection.findMany({
    where: {
      isVisible: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      postCount: true,
      topCategory: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return {
    profile: admin?.profile || null,
    subsections,
  };
}

export default async function Page() {
  const data = await getHomeData();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="flex">
        <Suspense fallback={<SidebarSkeleton />}>
          <PublicSidebarServer />
        </Suspense>

        <main className="ml-0 md:ml-48 flex-1 flex items-start justify-center p-6 md:p-12">
          <HomeContent profile={data.profile} subsections={data.subsections} />
        </main>
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="w-48 bg-[#0a0a0a] min-h-screen fixed left-0 top-0 hidden md:block">
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-neutral-800 rounded mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-neutral-800 rounded"></div>
            <div className="h-4 bg-neutral-800 rounded"></div>
            <div className="h-4 bg-neutral-800 rounded"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}