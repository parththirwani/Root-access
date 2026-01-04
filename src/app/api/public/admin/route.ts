import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    console.log("Admin endpoint")
  try {
    const admin = await prisma.admin.findFirst({
      select: {
        name: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ name: admin.name }, { status: 200 });
  } catch (error) {
    console.error("GET admin name error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}