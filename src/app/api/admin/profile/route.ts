import { getServerSession } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { updateProfileSchema } from "@/src/schema/profileSchema";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/src/lib/authWrapper";

async function getHandler(req: NextRequest) {
  try {
    const session = (req as any).session; // Attached by withAuth

    const profile = await prisma.profile.findUnique({
      where: { adminId: session.userId },
      select: {
        id: true,
        bio: true,
        xLink: true,
        instagramLink: true,
        linkedinLink: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

async function patchHandler(req: NextRequest) {
  try {
    const session = (req as any).session; // Attached by withAuth

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const profile = await prisma.profile.upsert({
      where: { adminId: session.userId },
      update: {
        bio: data.bio ?? undefined,
        xLink: data.xLink ?? undefined,
        instagramLink: data.instagramLink ?? undefined,
        linkedinLink: data.linkedinLink ?? undefined,
      },
      create: {
        adminId: session.userId,
        bio: data.bio ?? null,
        xLink: data.xLink ?? null,
        instagramLink: data.instagramLink ?? null,
        linkedinLink: data.linkedinLink ?? null,
      },
    });

    return NextResponse.json(
      { message: "Profile updated successfully", profile },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH profile error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);