import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const adminCount = await prisma.admin.count();
    return NextResponse.json({ 
      allowSignup: adminCount === 0 
    });
  } catch (error) {
    console.error('Check signup error:', error);
    return NextResponse.json({ 
      allowSignup: false 
    }, { status: 500 });
  }
}