import { prisma } from "@/src/lib/prisma";
import { sectionsSchema } from "@/src/schema/sectionSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
            return NextResponse.json(
                { message: "Requied details missing" },
                { status: 400 }
            )
        }
        const parsedData = sectionsSchema.safeParse(data)

        if (!parsedData.success) {
            return NextResponse.json(
                { message: "Invalid input or missing inputs" },
                { status: 403 }
            )
        }

        const { name, isVisble } = parsedData.data

        const existingSection = await prisma.topCategory.findUnique({
            where: { name }
        })

        if (existingSection) {
            return NextResponse.json(
                { message: "Section already exists" },
                { status: 409 }
            )
        }

        const section = await prisma.topCategory.create({
            data: {
                name: name,
                isVisible: isVisble
            }
        })

        return NextResponse.json(
            { message: "Section created" , section: section},
            { status: 200 }
        )
    } catch (err) {
        return NextResponse.json(
            { message: "Something went wrong", error: err },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
  try {
    const sections = await prisma.topCategory.findMany({
      include: {
        subsections: true 
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(
      { sections },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching sections:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
