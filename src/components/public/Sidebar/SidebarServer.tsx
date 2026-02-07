import Link from 'next/link';
import { prisma } from '@/src/lib/prisma';
import { SidebarClient } from './SidebarClient';

export async function PublicSidebarServer() {
  const layoutData = await prisma.admin.findFirst({
    select: {
      name: true,
      profile: {
        select: {
          xLink: true,
          instagramLink: true,
          linkedinLink: true,
          email: true,
          resumeUrl: true,
          profilePicture: true,
        },
      },
    },
    // Add sections with subsections
  });

  const sections = await prisma.topCategory.findMany({
    where: {
      isVisible: true,
    },
    select: {
      id: true,
      name: true,
      isVisible: true,
      subsections: {
        where: {
          isVisible: true,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          postCount: true,
        },
        orderBy: {
          name: 'asc',
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  const data = {
    admin: {
      name: layoutData?.name || '',
      profile: layoutData?.profile || null,
    },
    sections,
  };

  return <SidebarClient layoutData={data} />;
}