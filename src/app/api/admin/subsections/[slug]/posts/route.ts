import { prisma } from "@/src/lib/prisma";
import { postsSchema } from "@/src/schema/postsSchema";
import { NextRequest, NextResponse } from "next/server";
import { generateSlug, calculateReadTime, handleTags, generateExcerpt } from "@/src/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const data = await req.json();
    
    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      return NextResponse.json(
        { message: "Required details missing" },
        { status: 400 }
      );
    }

    const parsedData = postsSchema.safeParse(data);
    
    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid input or missing inputs"},
        { status: 400 }
      );
    }

    const { title, content, excerpt, coverImage, published, tags, metaTitle, metaDescription, description } = parsedData.data;

    const subSection = await prisma.subsection.findUnique({
      where: { slug }
    });

    if (!subSection) {
      return NextResponse.json(
        { message: `Subsection "${slug}" not found` },
        { status: 404 }
      );
    }

    const postSlug = generateSlug(title);

    const existingPost = await prisma.post.findUnique({
      where: { slug: postSlug }
    });

    if (existingPost) {
      return NextResponse.json(
        { message: "A post with this title already exists" },
        { status: 409 }
      );
    }

    const tagConnections = await handleTags(tags || [], prisma);

    const readTime = calculateReadTime(content);

    const finalExcerpt = generateExcerpt(content, excerpt);

    const post = await prisma.post.create({
      data: {
        title,
        description: description,
        slug: postSlug,
        content,
        excerpt: finalExcerpt,
        coverImage,
        published: published || false,
        publishedAt: published ? new Date() : null,
        subsectionId: subSection.id,
        readTime,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || finalExcerpt,
        tags: {
          connect: tagConnections
        }
      },
      include: {
        subsection: {
          select: {
            id: true,
            name: true,
            slug: true,
            topCategory: {
              select: {
                name: true
              }
            }
          }
        },
        tags: true
      }
    });

    await prisma.subsection.update({
      where: { id: subSection.id },
      data: {
        postCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json(
      { message: "Post created successfully", post },
      { status: 201 }
    );

  } catch (err) {
    console.error("Error creating post:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
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
          slug: slug
        }
      },
      include: {
        subsection: {
          select: {
            name: true,
            slug: true
          }
        },
        tags: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(
      { posts },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error fetching posts:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}