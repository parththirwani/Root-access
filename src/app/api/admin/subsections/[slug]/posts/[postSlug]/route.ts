import { prisma } from "@/src/lib/prisma";
import { updatePostSchema } from "@/src/schema/postsSchema";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/src/lib/authWrapper";
import { generateSlug, calculateReadTime, handleTags, generateExcerpt } from "@/src/lib/utils";
import { markdownToHtml, generateMarkdownExcerpt } from "@/src/lib/markdown";

async function getHandler(
  req: NextRequest,
  context: { params: Promise<{ postSlug: string }> }
) {
  try {
    const { postSlug } = await context.params;

    const post = await prisma.post.findUnique({
      where: { slug: postSlug },
      include: {
        subsection: {
          select: {
            name: true,
            slug: true,
            displayStyle: true,
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

    return NextResponse.json({ post }, { status: 200 });

  } catch (err) {
    console.error("Error fetching post:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

async function putHandler(
  req: NextRequest,
  context: { params: Promise<{ postSlug: string }> }
) {
  try {
    const { postSlug } = await context.params;
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
        { message: "Invalid input", errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const existingPost = await prisma.post.findUnique({
      where: { slug: postSlug },
      include: {
        subsection: {
          select: {
            displayStyle: true
          }
        }
      }
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const { title, content, excerpt, coverImage, published, tags, metaTitle, metaDescription, description, projectLink } = parsedData.data;

    const updateData: any = {};

    // Handle title update
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

    // Handle content update based on display style
    const displayStyle = existingPost.subsection.displayStyle;

    if (content !== undefined) {
      if (displayStyle === 'BLOG') {
        // Convert markdown to HTML for blog posts
        updateData.content = markdownToHtml(content);
        updateData.readTime = calculateReadTime(content);
        
        // Generate excerpt if not provided
        if (!excerpt) {
          updateData.excerpt = generateMarkdownExcerpt(content);
        }
      } else {
        // For non-blog posts, store as-is or empty
        updateData.content = content || '';
        updateData.readTime = 0;
      }
    }

    // Handle description
    if (description !== undefined) {
      updateData.description = displayStyle === 'TITLE_ONLY' ? '' : description;
    }

    // Handle excerpt
    if (excerpt !== undefined) {
      updateData.excerpt = excerpt;
    }

    // Handle cover image
    if (coverImage !== undefined) {
      updateData.coverImage = coverImage || null;
    }

    // Handle project link
    if (projectLink !== undefined) {
      updateData.projectLink = projectLink || null;
    }

    // Handle meta tags
    if (metaTitle !== undefined) {
      updateData.metaTitle = metaTitle;
    }
    if (metaDescription !== undefined) {
      updateData.metaDescription = metaDescription;
    }

    // Handle publish status
    if (published !== undefined) {
      updateData.published = published;
      if (published && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Handle tags
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

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { slug: postSlug },
      data: updateData,
      include: {
        subsection: {
          select: {
            name: true,
            slug: true,
            displayStyle: true,
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

async function deleteHandler(
  req: NextRequest,
  context: { params: Promise<{ postSlug: string }> }
) {
  try {
    const { postSlug } = await context.params;

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

async function patchHandler(
  req: NextRequest,
  context: { params: Promise<{ postSlug: string }> }
) {
  try {
    const { postSlug } = await context.params;
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

export const GET = withAuth(getHandler);
export const PUT = withAuth(putHandler);
export const DELETE = withAuth(deleteHandler);
export const PATCH = withAuth(patchHandler);