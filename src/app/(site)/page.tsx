import { prisma } from '@/src/lib/prisma';
import { HomeContent } from '../../components/public/HomeContent';

export const revalidate = 60;

async function getHomeData() {
  if (!process.env.DATABASE_URL) {
    console.log('[Build] Skipping home data fetch - no DATABASE_URL');
    return { profile: null, subsections: [] };
  }

  try {
    const [admin, subsections] = await Promise.all([
      prisma.admin.findFirst({
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
      }),
      prisma.subsection.findMany({
        where: { isVisible: true },
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          _count: {
            select: {
              posts: { where: { published: true } },
            },
          },
          topCategory: { select: { name: true } },
        },
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      profile: admin?.profile || null,
      subsections: subsections.map((sub) => ({
        ...sub,
        postCount: sub._count.posts,
      })),
    };
  } catch (error) {
    console.error('[Runtime] Failed to fetch home data:', error);
    return { profile: null, subsections: [] };
  }
}

export default async function Page() {
  const data = await getHomeData();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <main className="ml-0 md:ml-48 flex-1 flex items-start justify-center p-6 md:p-12">
        <HomeContent profile={data.profile} subsections={data.subsections} />
      </main>
    </div>
  );
}