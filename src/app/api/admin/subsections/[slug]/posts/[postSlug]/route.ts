import { prisma } from "@/src/lib/prisma";
import { updatePostSchema } from "@/src/schema/postsSchema";
import { NextRequest, NextResponse } from "next/server";
import { generateSlug, calculateReadTime, handleTags, generateExcerpt } from "@/src/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; postSlug: string }> }
) {
  try {
    const { postSlug } = await params;

    const post = await prisma.post.findUnique({
      where: { slug: postSlug },
      include: {
        subsection: {
          select: {
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; postSlug: string }> }
) {
  try {
    const { postSlug } = await params;
    const data = await req.json();

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "Required details missing" },
        { status: 400 }
      );
    }

    const parsedData = updatePostSchema.safeParse(data);

    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid input"},
        { status: 400 }
      );
    }

    const existingPost = await prisma.post.findUnique({
      where: { slug: postSlug }
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const { title, content, excerpt, coverImage, published, tags, metaTitle, metaDescription } = parsedData.data;

    const updateData: any = {};

    if (title) {
      updateData.title = title;
      const newSlug = generateSlug(title);
      
      if (newSlug !== postSlug) {
        const slugExists = await prisma.post.findUnique({
          where: { slug: newSlug }
        });

        if (slugExists) {
          return NextResponse.json(
            { message: "A post with this title already exists" },
            { status: 409 }
          );
        }

        updateData.slug = newSlug;
      }
    }

    if (content) {
      updateData.content = content;
      updateData.readTime = calculateReadTime(content);
      
      if (!excerpt) {
        updateData.excerpt = generateExcerpt(content);
      }
    }

    if (excerpt) updateData.excerpt = excerpt;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (metaTitle) updateData.metaTitle = metaTitle;
    if (metaDescription) updateData.metaDescription = metaDescription;

    if (published !== undefined) {
      updateData.published = published;
      if (published && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    if (tags) {
      const tagConnections = await handleTags(tags, prisma);
      
      await prisma.post.update({
        where: { slug: postSlug },
        data: {
          tags: {
            set: [],
            connect: tagConnections
          }
        }
      });
    }

    const updatedPost = await prisma.post.update({
      where: { slug: postSlug },
      data: updateData,
      include: {
        subsection: {
          select: {
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

    return NextResponse.json(
      { message: "Post updated successfully", post: updatedPost },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error updating post:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; postSlug: string }> }
) {
  try {
    const { postSlug } = await params;

    const existingPost = await prisma.post.findUnique({
      where: { slug: postSlug }
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { slug: postSlug }
    });

    await prisma.subsection.update({
      where: { id: existingPost.subsectionId },
      data: {
        postCount: {
          decrement: 1
        }
      }
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error deleting post:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; postSlug: string }> }
) {
  try {
    const { postSlug } = await params;
    const { published } = await req.json();

    if (typeof published !== "boolean") {
      return NextResponse.json(
        { message: "Invalid published status" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { slug: postSlug }
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { slug: postSlug },
      data: {
        published,
        publishedAt: published ? (post.publishedAt || new Date()) : post.publishedAt
      }
    });

    return NextResponse.json(
      { 
        message: `Post ${published ? 'published' : 'unpublished'} successfully`, 
        post: updatedPost 
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error updating publish status:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}