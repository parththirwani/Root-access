import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/src/lib/authWrapper";

async function getHandler(req: NextRequest) {
  try {
    const [sections, tags, postStats] = await Promise.all([
      prisma.topCategory.findMany({
        select: {
          id: true,
          _count: {
            select: {
              subsections: true,
            },
          },
        },
      }),
      prisma.tag.count(),
      prisma.post.aggregate({
        _count: true,
      }),
    ]);

    const totalSubsections = sections.reduce((sum, s) => sum + s._count.subsections, 0);

    return NextResponse.json({
      sections: sections.length,
      subsections: totalSubsections,
      posts: postStats._count,
      tags,
    }, { status: 200 });
  } catch (error) {
    console.error("GET stats error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);