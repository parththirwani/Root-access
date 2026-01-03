import { prisma } from "@/src/lib/prisma";
import { subsectionsSchema } from "@/src/schema/subsectionsSchema";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/src/lib/authWrapper";

async function postHandler(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      return NextResponse.json(
        { message: "Required details missing" },
        { status: 400 }
      );
    }

    const parsedData = subsectionsSchema.safeParse(data);
    
    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid input or missing inputs"},
        { status: 400 }
      );
    }

    const { name, isVisible, icon, topCategoryName } = parsedData.data;

    const topCategory = await prisma.topCategory.findUnique({
      where: { name: topCategoryName }
    });

    if (!topCategory) {
      return NextResponse.json(
        { message: `Category "${topCategoryName}" not found` },
        { status: 404 }
      );
    }

    const existingSubsection = await prisma.subsection.findFirst({
      where: { 
        name,
        topCategoryId: topCategory.id
      }
    });

    if (existingSubsection) {
      return NextResponse.json(
        { message: "Subsection already exists in this category" },
        { status: 409 }
      );
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const subsection = await prisma.subsection.create({
      data: {
        name,
        slug,
        isVisible,
        icon,
        topCategoryId: topCategory.id 
      },
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
      { message: "Subsection created", subsection },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating subsection:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(postHandler);