import { prisma } from '@/src/lib/prisma';
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const tag = await prisma.tag.findUnique({
      where: { slug: slug },
      include: {
        posts: {
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
            tags: true,
          },
          where: {
            published: true,
          },
          orderBy: {
            publishedAt: "desc",
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json(
        { message: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ tag }, { status: 200 });
  } catch (err) {
    console.error("Error fetching tag:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}