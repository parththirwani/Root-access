import { prisma } from "@/src/lib/prisma";
import { generateSlug } from "@/src/lib/utils";
import { tagsSchema } from "@/src/schema/tagSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
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

    const existingTag = await prisma.tag.findUnique({
      where: { name }, 
    });

    if (existingTag) {
      return NextResponse.json(
        { message: "Tag already exists" },
        { status: 400 }
      );
    }

    const slug = name

    const existingBySlug = await prisma.tag.findUnique({
      where: { slug },
    });
    if (existingBySlug) {
      return NextResponse.json(
        { message: "A similar tag already exists" },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: { name, slug },
    });

    return NextResponse.json(
      { message: "Tag is created", tag },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating tag:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
    try {
        const tags = await prisma.tag.findMany({
            include:{
                posts: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return NextResponse.json(
            { message: "Tags retrieved", tags: tags },
            { status: 200 }
        )
    } catch (err) {
        console.error("Error creating post:", err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}