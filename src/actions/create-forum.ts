"use server";

import { baseUrl } from "@/constants/baseUrl";
import serverAxiosInstance from "@/lib/server-axios";
import { revalidatePath } from "next/cache";

export async function createForum(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  if (!title || title.trim() === "") {
    return {
      success: false,
      message: "Title is required",
      errors: { title: "Title is required" },
      data: null,
    };
  }
  try {
    const { data } = await serverAxiosInstance.post(`${baseUrl}/forum`, {
      title,
    });
    revalidatePath("/");
    return {
      success: true,
      message: "Forum created successfully!",
      errors: null,
      data,
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      message: "Forum creation failed!",
      errors: {
        general: "An error occurred during forum creation.",
      },
      data: null,
    };
  }
}
