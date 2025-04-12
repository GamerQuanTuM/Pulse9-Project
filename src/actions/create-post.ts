"use server";

import { baseUrl } from "@/constants/baseUrl";
import serverAxiosInstance from "@/lib/server-axios";
import { revalidatePath } from "next/cache";

interface CreatePostData {
  title: string;
  content: string;
  forumId: string;
  image?: File | null;
}

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const forumId = formData.get("forumId") as string;
  let image = formData.get("image") as File | null;

  if (!title || title.trim() === "") {
    return {
      success: false,
      message: "Title is required",
      errors: { title: "Title is required" },
      data: null,
    };
  }

  if (!content || content.trim() === "") {
    return {
      success: false,
      message: "Content is required",
      errors: { content: "Content is required" },
      data: null,
    };
  }

  if (!forumId) {
    return {
      success: false,
      message: "Forum ID is required",
      errors: { forumId: "Forum ID is required" },
      data: null,
    };
  }

  try {
    const postData: CreatePostData = {
      title,
      content,
      forumId,
    };

    if (image && image?.size > 0) {
      postData.image = image;
    }

    const { data } = await serverAxiosInstance.post(
      `${baseUrl}/post`,
      postData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Revalidate the forum page to show the new post
    revalidatePath(`/forum/${forumId}`);

    return {
      success: true,
      message: "Post created successfully!",
      errors: null,
      data,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      message: "Post creation failed!",
      errors: {
        general: "An error occurred during post creation.",
      },
      data: null,
    };
  }
}
