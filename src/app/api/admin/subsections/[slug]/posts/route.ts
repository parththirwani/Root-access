// app/api/admin/subsections/[slug]/posts/route.ts

import { prisma } from "@/src/lib/prisma";
import { postsSchema } from "@/src/schema/postsSchema";
import { NextRequest, NextResponse } from "next/server";
import {
  generateSlug,
  calculateReadTime,
  handleTags,
  generateExcerpt,
} from "@/src/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Parse and validate request body
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

    // Find the subsection by slug
    const subsection = await prisma.subsection.findUnique({
      where: { slug },
    });

    if (!subsection) {
      return NextResponse.json(
        { message: `Subsection with slug "${slug}" not found` },
        { status: 404 }
      );
    }

    // Generate slug from title and check for uniqueness
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

    // Handle tags (creates or connects, now uppercase as per your previous change)
    const tagConnections = await handleTags(tags || [], prisma);

    // Generate read time and excerpt
    const readTime = calculateReadTime(content);
    const finalExcerpt = generateExcerpt(content, excerpt);

    // Create the post
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

    // Increment post count on subsection
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

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