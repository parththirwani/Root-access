import { notFound } from 'next/navigation';
import { prisma } from '@/src/lib/prisma';
import { serializePosts } from '@/src/lib/serialize';
import { unstable_cache } from 'next/cache';
import { SubsectionContent } from '@/src/components/public/SubsectionContent';

export const revalidate = 60;

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) {
    console.log('[Build] Skipping static generation for subsections - no DATABASE_URL');
    return [];
  }
  try {
    const subsections = await prisma.subsection.findMany({
      where: { isVisible: true },
      select: { slug: true },
      take: 100,
    });
    console.log(`[Build] Generated ${subsections.length} subsection routes`);
    return subsections.map((sub) => ({ slug: sub.slug }));
  } catch (error) {
    console.warn('[Build] Failed to generate static params:', error);
    return [];
  }
}

const getSubsectionData = (slug: string) =>
  unstable_cache(
    async () => {
      const subsection = await prisma.subsection.findUnique({
        where: { slug, isVisible: true },
        include: {
          posts: {
            where: { published: true },
            select: {
              title: true,
              slug: true,
              publishedAt: true,
              excerpt: true,
              description: true,
              coverImage: true,
              projectLink: true,
              tags: { select: { name: true } },
            },
            orderBy: { publishedAt: 'desc' },
          },
          topCategory: { select: { name: true } },
        },
      });

      if (!subsection) return null;
      return { ...subsection, posts: serializePosts(subsection.posts) };
    },
    [`subsection-${slug}`],
    { revalidate: 60 }
  )();

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subsection = await getSubsectionData(slug);

  if (!subsection) notFound();

  return (
    <div className="min-h-screen bg-[#101011] flex">
      <SubsectionContent subsection={subsection} slug={slug} />
    </div>
  );
}