import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/src/lib/prisma';
import { serializePosts } from '@/src/lib/serialize';
import { PublicSidebarServer } from '@/src/components/public/Sidebar/SidebarServer';
import { SubsectionContent } from '@/src/components/public/SubsectionContent';

export const revalidate = 60;

export async function generateStaticParams() {
  const subsections = await prisma.subsection.findMany({
    where: { isVisible: true },
    select: { slug: true },
  });

  return subsections.map((sub) => ({
    slug: sub.slug,
  }));
}

async function getSubsectionData(slug: string) {
  const subsection = await prisma.subsection.findUnique({
    where: {
      slug: slug,
      isVisible: true,
    },
    include: {
      posts: {
        where: {
          published: true,
        },
        select: {
          title: true,
          slug: true,
          publishedAt: true,
          excerpt: true,
          description: true,
          coverImage: true,
          projectLink: true,
          tags: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
      },
      topCategory: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!subsection) return null;

  // Serialize dates to strings for client components
  return {
    ...subsection,
    posts: serializePosts(subsection.posts),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subsection = await getSubsectionData(slug);

  if (!subsection) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#101011]">
      <div className="flex">
        <Suspense fallback={<SidebarSkeleton />}>
          <PublicSidebarServer />
        </Suspense>

        <SubsectionContent subsection={subsection} slug={slug} />
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="w-48 bg-[#0a0a0a] min-h-screen fixed left-0 top-0">
      <div className="p-6 animate-pulse">
        <div className="h-5 bg-neutral-800 rounded mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-neutral-800 rounded"></div>
          <div className="h-4 bg-neutral-800 rounded"></div>
        </div>
      </div>
    </aside>
  );
}