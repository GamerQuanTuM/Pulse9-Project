import { NextResponse } from "next/server";
import { AuthenticatedRequest, withAuth } from "@/lib/auth-middleware";
import prisma from "@/lib/prisma";

// Define the correct RouteContext type to match what withAuth expects
type RouteContext = {
  params: { [key: string]: string | string[] }
}

const getForum = async (
  request: AuthenticatedRequest,
  context: RouteContext
) => {
  try {
    const id = typeof context.params.id === "string" ? context.params.id : context.params.id?.[0]

    if (!id) {
      return NextResponse.json({ message: "Id is required" }, { status: 400 })
    }

    const forum = await prisma.forum.findUnique({
      where: {
        id: id,
      },
      include: {
        posts: {
          include: {
            author: true,
          },
        },
      },
    });

    const author = await prisma.author.findUnique({
      where: {
        id: forum?.authorId,
      },
    });

    if (!forum) {
      return NextResponse.json({ message: "Forum not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Success",
        data: {
          ...forum,
          authorName: author?.name,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: null },
      { status: 500 }
    );
  }
};

const deleteForum = async (
  request: AuthenticatedRequest,
  context: RouteContext
) => {
  try {
     // Extract the id parameter, handling both string and string[] cases
     const id = typeof context.params.id === "string" ? context.params.id : context.params.id?.[0]

     if (!id) {
       return NextResponse.json({ message: "Id is required" }, { status: 400 })
     }

    const isForumPresent = await prisma.forum.findUnique({
      where: {
        id: id,
      },
    });

    if (!isForumPresent) {
      return NextResponse.json({ message: "Forum not found" }, { status: 404 });
    }

    const isAuthor = isForumPresent?.authorId === request.user?.id;

    if (!isAuthor) {
      return NextResponse.json(
        { message: "You are not authorized to delete this forum" },
        { status: 403 }
      );
    }

    const forum = await prisma.forum.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Success", data: forum },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: null },
      { status: 500 }
    );
  }
};

export const DELETE = withAuth(deleteForum);
export const GET = withAuth(getForum);
