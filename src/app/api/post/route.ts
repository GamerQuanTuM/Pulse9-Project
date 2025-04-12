import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { AuthenticatedRequest, withAuth } from "@/lib/auth-middleware";
import prisma from "@/lib/prisma";

const createPost = async (request: AuthenticatedRequest) => {
  try {
    const user_id = request.user?.id;

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const forumId = formData.get('forumId') as string;
    const image = formData.get('image') as string;

    if (!title || !content || !forumId) {
      return NextResponse.json(
        { message: "Title, content, and forumId are required", data: null },
        { status: 400 }
      );
    }

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

    const post = await prisma.post.create({
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
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: error.message, data: null },
      { status: 500 }
    );
  }
};

const getPosts = async (request: AuthenticatedRequest) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        forum: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { message: "Success", data: posts },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: null },
      { status: 500 }
    );
  }
};

export const POST = withAuth(createPost);
export const GET = withAuth(getPosts);
