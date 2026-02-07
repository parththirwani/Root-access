import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/src/lib/prisma';
import { serializePost } from '@/src/lib/serialize';

import { BreadcrumbNav } from '@/src/components/public/BreadcrumbNav';
import { PublicSidebarServer } from '@/src/components/public/Sidebar/SidebarServer';
import { PostContent } from '@/src/components/public/PostContent';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: {
      slug: true,
      subsection: {
        select: {
          slug: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    slug: post.subsection.slug,
    postSlug: post.slug,
  }));
}

async function getPostData(postSlug: string) {
  const post = await prisma.post.findUnique({
    where: { slug: postSlug, published: true },
    include: {
      subsection: {
        select: {
          name: true,
          slug: true,
        },
      },
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!post) return null;
  return serializePost(post);
}

// Increment views on the server (non-blocking)
async function incrementViews(postSlug: string) {
  try {
    await prisma.post.update({
      where: { slug: postSlug },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    // Silently fail - don't block page render
    console.error('Failed to increment views:', error);
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>;
}) {
  const { slug, postSlug } = await params;
  const post = await getPostData(postSlug);

  if (!post) {
    notFound();
  }

  incrementViews(postSlug);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <Suspense fallback={<SidebarSkeleton />}>
        <PublicSidebarServer />
      </Suspense>

      <main className="flex-1 lg:ml-48">
        <div className="p-4 sm:p-6">
          <div className="sticky top-0 z-50 bg-[#101010]/95 backdrop-blur border-b border-black rounded-t-2xl">
            <BreadcrumbNav
              items={[
                { label: post.subsection.name, href: `/${slug}` },
                { label: post.title },
              ]}
            />
          </div>

          <div className="bg-[#101010] rounded-b-2xl border border-black">
            <PostContent post={post} />
          </div>
        </div>
      </main>
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