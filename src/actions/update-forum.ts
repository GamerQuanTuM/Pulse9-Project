"use server";

import { baseUrl } from "@/constants/baseUrl";
import serverAxiosInstance from "@/lib/server-axios";
import { revalidatePath } from "next/cache";

export async function updateForum(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const id = formData.get("id") as string;
  if (!title || title.trim() === "") {
    return {
      success: false,
      message: "Title is required",
      errors: { title: "Title is required" },
      data: null,
    };
  }
  try {
    const { data } = await serverAxiosInstance.put(`${baseUrl}/forum`, {
      title,
      id,
    });
    revalidatePath("/");
    return {
      success: true,
      message: "Forum updated successfully!",
      errors: null,
      data,
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      message: "Forum update failed!",
      errors: {
        general: "An error occurred during forum update.",
      },
      data: null,
    };
  }
}
