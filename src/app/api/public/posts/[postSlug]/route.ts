import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postSlug: string }> }
) {
  try {
    const { postSlug } = await context.params;

    const post = await prisma.post.findUnique({
      where: { slug: postSlug , published: true, },
      include: {
        subsection: {
          select: {
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            name: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    await prisma.post.update({
      where: { slug: postSlug },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json({ post }, { status: 200 });

  } catch (err) {
    console.error("Error fetching post:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}