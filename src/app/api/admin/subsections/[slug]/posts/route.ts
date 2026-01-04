import { prisma } from "@/src/lib/prisma";
import { postsSchema } from "@/src/schema/postsSchema";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/src/lib/authWrapper";
import {
  generateSlug,
  calculateReadTime,
  handleTags,
  generateExcerpt,
} from "@/src/lib/utils";

async function postHandler(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const body = await req.json();

    if (!body || (typeof body === "object" && Object.keys(body).length === 0)) {
      return NextResponse.json(
        { message: "Request body is required" },
        { status: 400 }
      );
    }

    const parsedData = postsSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        {
          message: "Invalid or missing fields",
          errors: parsedData.error.format(),
        },
        { status: 400 }
      );
    }

    const {
      title,
      content,
      excerpt,
      coverImage,
      published,
      tags,
      metaTitle,
      metaDescription,
      description,
    } = parsedData.data;

    const subsection = await prisma.subsection.findUnique({
      where: { slug },
    });

    if (!subsection) {
      return NextResponse.json(
        { message: `Subsection with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    const postSlug = generateSlug(title);

    const existingPost = await prisma.post.findUnique({
      where: { slug: postSlug },
    });

    if (existingPost) {
      return NextResponse.json(
        { message: `A post with the title "${title}" already exists (slug conflict)` },
        { status: 409 }
      );
    }

    const tagConnections = await handleTags(tags || [], prisma);

    const readTime = calculateReadTime(content);
    const finalExcerpt = generateExcerpt(content, excerpt);

    const post = await prisma.post.create({
      data: {
        title,
        description,
        slug: postSlug,
        content,
        excerpt: finalExcerpt,
        coverImage,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
        readTime,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || finalExcerpt,
        subsectionId: subsection.id,
        tags: {
          connect: tagConnections,
        },
      },
      include: {
        subsection: {
          select: {
            id: true,
            name: true,
            slug: true,
            topCategory: {
              select: {
                name: true,
              },
            },
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    await prisma.subsection.update({
      where: { id: subsection.id },
      data: {
        postCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(
      { message: "Post created successfully", post },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating post:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getHandler(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const posts = await prisma.post.findMany({
      where: {
        subsection: {
          slug: slug,
        },
      },
      include: {
        subsection: {
          select: {
            id: true,
            name: true,
            slug: true,
            topCategory: {
              select: {
                name: true,
              },
            },
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(postHandler);
export const GET = withAuth(getHandler);