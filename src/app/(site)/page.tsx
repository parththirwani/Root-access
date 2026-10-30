import { prisma } from '@/src/lib/prisma';
import { HomeContent } from '../../components/public/HomeContent';

export const revalidate = 60;

async function getHomeData() {
  if (!process.env.DATABASE_URL) {
    console.log('[Build] Skipping home data fetch - no DATABASE_URL');
    return { name: 'Parth Thirwani', profile: null, subsections: [] };
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
      name: admin?.name || 'Parth Thirwani',
      profile: admin?.profile || null,
      subsections: subsections.map((sub) => ({
        ...sub,
        postCount: sub._count.posts,
      })),
    };
  } catch (error) {
    console.error('[Runtime] Failed to fetch home data:', error);
    return { name: 'Parth Thirwani', profile: null, subsections: [] };
  }
}

export default async function Page() {
  const data = await getHomeData();

  return (
    <main id="main-content"><HomeContent name={data.name} profile={data.profile} subsections={data.subsections} /></main>
  );
}
