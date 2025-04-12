import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

type RequestBody = {
  name: string;
  email: string;
  password: string;
};

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = (await request.json()) as RequestBody;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.author.findUnique({ where: { email } });

    // If user exists, check password and log in
    if (existingUser) {
      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

      if (!isPasswordCorrect) {
        return NextResponse.json(
          { message: "Incorrect password" },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { sub: existingUser.id, email: existingUser.email },
        process.env.JWT_SECRET || "fallback-secret-key",
        { expiresIn: "7d" }
      );

      return NextResponse.json(
        {
          message: "Logged in successfully",
          data: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            token,
          },
        },
        { status: 200 }
      );
    }

    // If user doesn't exist, create a new one
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.author.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { sub: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Registered successfully",
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          token,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
