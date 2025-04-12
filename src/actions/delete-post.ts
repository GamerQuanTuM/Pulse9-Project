"use server";

import { baseUrl } from "@/constants/baseUrl";
import serverAxiosInstance from "@/lib/server-axios";
import { revalidatePath } from "next/cache";

export async function deletePost(id:string) {

  try {
    const { data } = await serverAxiosInstance.delete(`${baseUrl}/post/${id}`);
    revalidatePath("/");
    return {
      success: true,
      message: "Post deleted successfully!",
      errors: null,
      data,
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      message: "Post delete failed!",
      errors: {
        general: "An error occurred during post delete.",
      },
      data: null,
    };
  }
}
