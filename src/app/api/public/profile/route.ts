// src/app/api/public/profile/route.ts (NEW FILE)

import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get the first admin's profile (assuming single admin blog)
    const admin = await prisma.admin.findFirst({
      include: {
        profile: {
          select: {
            id: true,
            bio: true,
            xLink: true,
            instagramLink: true,
            linkedinLink: true,
          },
        },
      },
    });

    if (!admin || !admin.profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile: admin.profile }, { status: 200 });
  } catch (error) {
    console.error("GET public profile error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}