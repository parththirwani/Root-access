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
            title: true,
            publishedAt: true,
            excerpt: true,
            tags: {
              select: {
                name: true,
              },
            },
          },
        },
        topCategory: {
          select: {
            name: true,
          },
        },
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