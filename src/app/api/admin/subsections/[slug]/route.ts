import { prisma } from "@/src/lib/prisma";
import { updateSubsectionSchema } from "@/src/schema/subsectionsSchema";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/src/lib/authWrapper";

async function putHandler(
  req: NextRequest, 
  context: { params: Promise<{ slug: string }> } 
) {
  try {
    const { slug } = await context.params;
    const data = await req.json();

    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      return NextResponse.json(
        { message: "Required details missing" },
        { status: 400 }
      );
    }

    const parsedData = updateSubsectionSchema.safeParse(data);

    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid input or missing inputs"},
        { status: 400 }
      );
    }

    const subsection = await prisma.subsection.findUnique({
      where: { slug }
    });

    if (!subsection) {
      return NextResponse.json(
        { message: "Subsection doesn't exist" },
        { status: 404 } 
      );
    }

    const { name, isVisible, icon, topCategoryName } = parsedData.data;

    const updateData: any = {};

    if (topCategoryName) {
      const topCategory = await prisma.topCategory.findUnique({
        where: { name: topCategoryName }
      });

      if (!topCategory) {
        return NextResponse.json(
          { message: `Category "${topCategoryName}" not found` },
          { status: 404 }
        );
      }

      updateData.topCategoryId = topCategory.id; 
    }

    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      
      const slugExists = await prisma.subsection.findUnique({
        where: { slug: updateData.slug }
      });

      if (slugExists && slugExists.id !== subsection.id) {
        return NextResponse.json(
          { message: "A subsection with this name already exists" },
          { status: 409 }
        );
      }
    }

    if (isVisible !== undefined) {
      updateData.isVisible = isVisible;
    }

    if (icon) {
      updateData.icon = icon;
    }

    const updatedSubSection = await prisma.subsection.update({
      where: { slug }, 
      data: updateData,
      include: {
        topCategory: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(
      { 
        message: "Subsection updated successfully", 
        subsection: updatedSubSection 
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error updating subsection:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

async function deleteHandler(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const subsection = await prisma.subsection.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    if (!subsection) {
      return NextResponse.json(
        { message: "Subsection not found" },
        { status: 404 }
      );
    }

    if (subsection._count.posts > 0) {
      return NextResponse.json(
        { 
          message: `Cannot delete subsection with ${subsection._count.posts} posts`,
          postCount: subsection._count.posts
        },
        { status: 409 }
      );
    }

    await prisma.subsection.delete({
      where: { slug }
    });

    return NextResponse.json(
      { message: "Subsection deleted successfully" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error deleting subsection:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(putHandler);
export const DELETE = withAuth(deleteHandler);