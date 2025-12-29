import { prisma } from '@/src/lib/prisma';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        posts: {
          some: {
            published: true,
          },
        },
      },
      include: {
        posts: {
          where: {
            published: true,
          },
          select: {
            id: true,
            title: true,
            excerpt: true,
            publishedAt: true,
            subsection: {
              select: {
                name: true,
                slug: true,
              },
            },
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            publishedAt: "desc",
          },
        },
      },
      orderBy: {
        name: "asc", 
      },
    });

    return NextResponse.json({ tags }, { status: 200 });
  } catch (err) {
    console.error("Error fetching tags:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}