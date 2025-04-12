import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";

async function profile(request: AuthenticatedRequest) {
  try {
    const userId = request.user?.id;
    const userEmail = request.user?.email;

    if (!userId || !userEmail) {
      return NextResponse.json(
        { message: "Invalid user data" },
        { status: 401 }
      );
    }

    const author = await prisma.author.findUnique({
      where: {
        id: userId,
        email: userEmail,
      },
      include: {
        posts: true,
        forums: true,
      },
    });

    if (!author) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { password, ...rest } = author;

    return NextResponse.json(
      { message: "Success", data: rest },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: null },
      { status: 500 }
    );
  }
}

export const GET = withAuth(profile);
