import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { AuthenticatedRequest, RouteContext, withAuth } from "@/lib/auth-middleware";
import prisma from "@/lib/prisma";

const getPost = async (
  request: AuthenticatedRequest,
  context: RouteContext
) => {
  try {
    const parameters = await context.params;
    if (!parameters || !parameters.id) {
      return NextResponse.json({ message: "Id is required" }, { status: 400 });
    }

    const id = parameters.id;

    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
        forum: true,
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Success", data: post },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: null },
      { status: 500 }
    );
  }
};

const deletePost = async (
  request: AuthenticatedRequest,
  context: RouteContext
) => {
  try {
    const parameters = await context.params;
    if (!parameters || !parameters.id) {
      return NextResponse.json({ message: "Id is required" }, { status: 400 });
    }

    const id = parameters.id;

    const isPostPresent = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!isPostPresent) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const isAuthor = isPostPresent?.authorId === request.user?.id;

    if (!isAuthor) {
      return NextResponse.json(
        { message: "You are not authorized to delete this post" },
        { status: 403 }
      );
    }

    const post = await prisma.post.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Success", data: post },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: null },
      { status: 500 }
    );
  }
};

const updatePost = async (request: AuthenticatedRequest,  context: RouteContext) => {
  try {
    const user_id = request.user?.id;

    if (!user_id) {
      return NextResponse.json(
        { message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const parameters = await context.params;
    if (!parameters || !parameters.id) {
      return NextResponse.json({ message: "Id is required" }, { status: 400 });
    }

    const id = parameters.id;

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const forumId = formData.get('forumId') as string;
    const image = formData.get('image') as string;

    // Check if forum exists
    const forum = await prisma.forum.findUnique({
      where: {
        id: forumId,
      },
    });

    if (!forum) {
      return NextResponse.json(
        { message: "Forum not found", data: null },
        { status: 404 }
      );
    }

    const isPostPresent = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    const isAuthor = isPostPresent?.authorId === request.user?.id;

    if (!isAuthor) {
      return NextResponse.json(
        { message: "You are not authorized to update this post" },
        { status: 403 }
      );
    }

    // Upload image to public folder and get image url
    let imageUrl;
    if (image) {
      const imageBuffer = Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const imageName = `${Date.now()}.png`;
      const imagePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        imageName
      );

      // Ensure uploads directory exists
      await fs.promises.mkdir(path.join(process.cwd(), "public", "uploads"), {
        recursive: true,
      });

      // Write the image file
      await fs.promises.writeFile(imagePath, imageBuffer);

      imageUrl = `/uploads/${imageName}`;
      if (!imageUrl) {
        return NextResponse.json(
          { message: "Image upload failed", data: null },
          { status: 500 }
        );
      }
    }

    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        image: imageUrl,
        author: {
          connect: {
            id: user_id,
          },
        },
        forum: {
          connect: {
            id: forumId,
          },
        },
      },
      include: {
        author: true,
        forum: true,
      },
    });

    return NextResponse.json(
      { message: "Success", data: post },
      { status: 201 }
    );
  }  catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: null },
      { status: 500 }
    ); 
  }
}


export const DELETE = withAuth(deletePost);
export const GET = withAuth(getPost);
export const PUT = withAuth(updatePost);