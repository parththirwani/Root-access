import { prisma } from "@/src/lib/prisma";
import { updateSectionSchema } from "@/src/schema/sectionSchema";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/src/lib/authWrapper";

async function putHandler(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const data = await req.json();

    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      return NextResponse.json(
        { message: "Required details missing" },
        { status: 400 }
      );
    }

    const parsedData = updateSectionSchema.safeParse(data);

    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid input or missing inputs" },
        { status: 400 }
      );
    }

    const { name, isVisible } = parsedData.data;

    const existingSection = await prisma.topCategory.findUnique({
      where: { id },
    });

    if (!existingSection) {
      return NextResponse.json(
        { message: "Section not found" },
        { status: 404 }
      );
    }

    const updatedSection = await prisma.topCategory.update({
      where: { id },
      data: {
        name,
        isVisible: isVisible,
      },
    });

    return NextResponse.json(
      { message: "Section updated", section: updatedSection },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating section:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

async function deleteHandler(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const existingSection = await prisma.topCategory.findUnique({
      where: { id },
    });

    if (!existingSection) {
      return NextResponse.json(
        { message: "Section not found" },
        { status: 404 }
      );
    }

    await prisma.topCategory.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Section deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting section:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(putHandler);
export const DELETE = withAuth(deleteHandler);