"use server";

import { baseUrl } from "@/constants/baseUrl";
import serverAxiosInstance from "@/lib/server-axios";
import { revalidatePath } from "next/cache";

interface UpdatePostData {
  id: string;
  title: string;
  content: string;
  image?: File | null;
}

export async function updatePost(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const forumId = formData.get("forumId") as string;
  let image = formData.get("image") as File | null;

  if (!id) {
    return {
      success: false,
      message: "Post ID is required",
      errors: { id: "Post ID is required" },
      data: null,
    };
  }

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

  try {
    const postData: UpdatePostData = {
      id,
      title,
      content,
    };

    if (image && image?.size > 0) {
      postData.image = image;
    }

    console.log(image);

    const { data } = await serverAxiosInstance.put(
      `${baseUrl}/post/${id}`,
      postData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    revalidatePath(`/forum/${forumId}`);
    revalidatePath(`/forum/${forumId}/post/${id}`);

    return {
      success: true,
      message: "Post updated successfully!",
      errors: null,
      data,
    };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      message: "Post update failed!",
      errors: {
        general: "An error occurred during post update.",
      },
      data: null,
    };
  }
}
