import { prisma } from "@/src/lib/prisma";
import { signupSchema } from "@/src/schema/authSchema";

import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
            return NextResponse.json(
                { message: "Credentials are missing" },
                { status: 400 }
            )
        }
        const parsedData = signupSchema.safeParse(data)

        if (!parsedData.success) {
            return NextResponse.json(
                { message: "Invalid input or missing inputs" },
                { status: 403 }
            )
        }

        const { email, secretKey, name } = parsedData.data

        const existingUser = await prisma.admin.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists. Please login" },
                { status: 409 }
            )
        }

        const hashedKey = await bcrypt.hash(secretKey, 10)

        const user = await prisma.admin.create({
            data: {
                name: name,
                email: email,
                secretKey: hashedKey,
            }
        })

        return NextResponse.json(
            { message: "User successfully signed up" },
            { status: 200 }
        )
    } catch (err) {
        return NextResponse.json(
            { message: "Something went wrong", error: err },
            { status: 500 }
        )
    }
}