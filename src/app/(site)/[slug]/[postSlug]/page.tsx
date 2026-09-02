import { notFound } from 'next/navigation';
import { prisma } from '@/src/lib/prisma';
import { serializePost } from '@/src/lib/serialize';

import { BreadcrumbNav } from '@/src/components/public/BreadcrumbNav';
import { PostContent } from '@/src/components/public/PostContent';

export const revalidate = 60;

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) {
    console.log('[Build] Skipping static generation for posts - no DATABASE_URL');
    return [];
  }

  try {
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
      take: 100,
    });

    console.log(`[Build] Generated ${posts.length} post routes`);
    return posts.map((post) => ({
      slug: post.subsection.slug,
      postSlug: post.slug,
    }));
  } catch (error) {
    console.warn('[Build] Failed to generate static params - database not accessible:', error);
    return [];
  }
}

async function getPostData(postSlug: string) {
  if (!process.env.DATABASE_URL) {
    console.warn('[Runtime] DATABASE_URL not available');
    return null;
  }

  try {
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
  } catch (error) {
    console.error('[Runtime] Failed to fetch post data:', error);
    return null;
  }
}

// Increment views on the server (non-blocking)
async function incrementViews(postSlug: string) {
  if (!process.env.DATABASE_URL) return;

  try {
    await prisma.post.update({
      where: { slug: postSlug },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error('[Runtime] Failed to increment views:', error);
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

  // Fire and forget - don't await
  incrementViews(postSlug);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Offset for desktop sidebar; on mobile sidebar is hidden */}
      <main className="flex-1 md:ml-48 min-w-0">
        <div className="p-2 sm:p-4">
          {/* Sticky Breadcrumb */}
          <div className="sticky top-0 z-50 bg-[#101010]/95 backdrop-blur border-b border-black rounded-t-2xl">
            <BreadcrumbNav
              items={[
                { label: post.subsection.name, href: `/${slug}` },
                { label: post.title },
              ]}
            />
          </div>

          {/* Content card */}
          <div className="bg-[#101010] rounded-b-2xl border border-black border-t-0">
            <PostContent post={post} />
          </div>
        </div>
      </main>
    </div>
  );
}