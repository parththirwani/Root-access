import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const subsections = await prisma.subsection.findMany({
      where: {
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
            slug: true,
            publishedAt: true,
            excerpt: true,
            subsection: {
              select: {
                slug: true,
                name: true,
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
        topCategory: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { message: "Subsections retrieved", subsections },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error retrieving subsections:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}