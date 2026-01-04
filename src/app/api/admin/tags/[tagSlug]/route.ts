import { prisma } from '@/src/lib/prisma';
import { tagsSchema } from '@/src/schema/tagSchema';
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/src/lib/authWrapper";

async function getHandler(
  req: NextRequest,
  context: { params: Promise<{ tagSlug: string }> }
) {
  try {
    const { tagSlug } = await context.params;

    const tag = await prisma.tag.findUnique({
      where: { slug: tagSlug },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            publishedAt: true,
            readTime: true,
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

async function putHandler(
  req: NextRequest,
  context: { params: Promise<{ tagSlug: string }> }
) {
  try {
    const { tagSlug } = await context.params;
    const data = await req.json();

    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      return NextResponse.json(
        { message: "Required details missing" },
        { status: 400 }
      );
    }

    const parsedData = tagsSchema.safeParse(data);
    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid input or missing inputs" },
        { status: 400 }
      );
    }

    let { name } = parsedData.data;

    name = name.trim().toUpperCase();

    const foundTag = await prisma.tag.findUnique({
      where: { slug: tagSlug },
    });

    if (!foundTag) {
      return NextResponse.json(
        { message: "Tag not found" },
        { status: 404 }
      );
    }

    if (name !== foundTag.name) {
      const existingTagWithName = await prisma.tag.findUnique({
        where: { name },
      });

      if (existingTagWithName) {
        return NextResponse.json(
          { message: "A tag with this name already exists" },
          { status: 409 }
        );
      }
    }

    const newSlug = name;

    if (newSlug !== tagSlug) {
      const slugExists = await prisma.tag.findUnique({
        where: { slug: newSlug },
      });

      if (slugExists) {
        return NextResponse.json(
          { message: "A tag with a similar name (same slug) already exists" },
          { status: 409 }
        );
      }
    }

    const updatedTag = await prisma.tag.update({
      where: { slug: tagSlug },
      data: {
        name,
        slug: newSlug,
      },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json(
      { message: "Tag updated successfully", tag: updatedTag },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating tag:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

async function deleteHandler(
  req: NextRequest,
  context: { params: Promise<{ tagSlug: string }> }
) {
  try {
    const { tagSlug } = await context.params;

    const foundTag = await prisma.tag.findUnique({
      where: { slug: tagSlug },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!foundTag) {
      return NextResponse.json(
        { message: "Tag not found" },
        { status: 404 }
      );
    }

    if (foundTag._count.posts > 0) {
      return NextResponse.json(
        {
          message: `Cannot delete tag with ${foundTag._count.posts} associated post(s). Remove the tag from posts first.`,
          postCount: foundTag._count.posts,
        },
        { status: 409 }
      );
    }

    await prisma.tag.delete({
      where: { slug: tagSlug },
    });

    return NextResponse.json(
      { message: "Tag deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting tag:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
export const PUT = withAuth(putHandler);
export const DELETE = withAuth(deleteHandler);