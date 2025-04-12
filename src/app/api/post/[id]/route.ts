import { NextResponse } from "next/server"
import { type AuthenticatedRequest, withAuth } from "@/lib/auth-middleware"
import prisma from "@/lib/prisma"
import path from "path"
import fs from "fs"

// Define the correct RouteContext type to match what withAuth expects
type RouteContext = {
  params: { [key: string]: string | string[] }
}

const getPost = async (request: AuthenticatedRequest, context: RouteContext) => {
  try {
    // Extract the id parameter, handling both string and string[] cases
    const id = typeof context.params.id === "string" ? context.params.id : context.params.id?.[0]

    if (!id) {
      return NextResponse.json({ message: "Id is required" }, { status: 400 })
    }

    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
        forum: true,
      },
    })

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Success", data: post }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message, data: null }, { status: 500 })
  }
}

const deletePost = async (request: AuthenticatedRequest, context: RouteContext) => {
  try {
    // Extract the id parameter, handling both string and string[] cases
    const id = typeof context.params.id === "string" ? context.params.id : context.params.id?.[0]

    if (!id) {
      return NextResponse.json({ message: "Id is required" }, { status: 400 })
    }

    const isPostPresent = await prisma.post.findUnique({
      where: {
        id: id,
      },
    })

    if (!isPostPresent) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    const isAuthor = isPostPresent?.authorId === request.user?.id

    if (!isAuthor) {
      return NextResponse.json({ message: "You are not authorized to delete this post" }, { status: 403 })
    }

    const post = await prisma.post.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({ message: "Success", data: post }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message, data: null }, { status: 500 })
  }
}

const updatePost = async (request: AuthenticatedRequest, context: RouteContext) => {
  try {
    // Extract the id parameter, handling both string and string[] cases
    const id = typeof context.params.id === "string" ? context.params.id : context.params.id?.[0]

    if (!id) {
      return NextResponse.json({ message: "Id is required" }, { status: 400 })
    }

    const user_id = request.user?.id

    // Check if post exists and user is the author
    const existingPost = await prisma.post.findUnique({
      where: {
        id: id,
      },
    })

    if (!existingPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    const isAuthor = existingPost?.authorId === user_id
    if (!isAuthor) {
      return NextResponse.json({ message: "You are not authorized to update this post" }, { status: 403 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const image = formData.get("image") as string

    if (!title || !content) {
      return NextResponse.json({ message: "Title and content are required", data: null }, { status: 400 })
    }

    // Handle image update if provided
    let imageUrl = existingPost.image
    if (image && image !== existingPost.image) {
      const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64")
      const imageName = `${Date.now()}.png`
      const imagePath = path.join(process.cwd(), "public", "uploads", imageName)

      // Ensure uploads directory exists
      await fs.promises.mkdir(path.join(process.cwd(), "public", "uploads"), {
        recursive: true,
      })

      // Write the image file
      await fs.promises.writeFile(imagePath, imageBuffer)

      imageUrl = `/uploads/${imageName}`
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
        image: imageUrl,
      },
      include: {
        author: true,
        forum: true,
      },
    })

    return NextResponse.json({ message: "Success", data: updatedPost }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating post:", error)
    return NextResponse.json({ message: error.message, data: null }, { status: 500 })
  }
}

export const DELETE = withAuth(deletePost)
export const PUT = withAuth(updatePost)
export const GET = withAuth(getPost)
