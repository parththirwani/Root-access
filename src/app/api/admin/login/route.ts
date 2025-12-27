import { prisma } from "@/src/lib/prisma";
import { signinSchema } from "@/src/schema/adminSchema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data) {
      return NextResponse.json(
        { message: "Credentials are missing" },
        { status: 400 }
      );
    }

    const parsedData = signinSchema.safeParse(data);
    
    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 403 }
      );
    }

    const { email, secretKey } = parsedData.data;

    const user = await prisma.admin.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" }, 
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(secretKey, user.secretKey);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        email: email,
        userId: user.id
      },
      JWT_SECRET!,
      { expiresIn: "7d" } 
    );

    const response = NextResponse.json(
      {message: "User successfully logged in"},
      { status: 200 }
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax", 
      maxAge: 60 * 60 * 24 * 7, 
      path: "/" 
    });

    return response;

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}