import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params; 

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
            id: true,
            title: true,
            description: true,
            slug: true,
            publishedAt: true,
            excerpt: true,
            coverImage: true,
            projectLink: true,
            tags: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            publishedAt: "desc",
          },
        },
        topCategory: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!subsection) {
      return NextResponse.json(
        { message: "Subsection not found or not visible" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Subsection retrieved", subsection },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error retrieving subsection:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}