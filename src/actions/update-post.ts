"use server";

import { baseUrl } from "@/constants/baseUrl";
import serverAxiosInstance from "@/lib/server-axios";
import { revalidatePath } from "next/cache";

interface UpdatePostData {
  title: string;
  content: string;
  image?: any;
  forumId: string;
}

export async function updatePost(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const forumId = formData.get("forumId") as string;
  let image = formData.get("image") as any;

  if (!id) {
    return {
      success: false,
      message: "Post ID is required",
      errors: { id: "Post ID is required" },
      data: null,
    };
  }

  try {
    const postData: UpdatePostData = {
      title,
      content,
      forumId
    };

    if (image && image?.size != 0) {
      postData.image = image;
    }

    const { data } = await serverAxiosInstance.put(`/post/${id}`, postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });


    revalidatePath(`/forum/${forumId}`);
    revalidatePath(`/forum/${forumId}/post/${id}`);

    return {
      success: true,
      message: "Post updated successfully!",
      errors: null,
      data,
    };
  } catch (error:any) {
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
