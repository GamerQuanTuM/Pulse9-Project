"use server";

import { baseUrl } from "@/constants/baseUrl";
import serverAxiosInstance from "@/lib/server-axios";
import { revalidatePath } from "next/cache";

export async function deleteForum(id:string) {

  try {
    const { data } = await serverAxiosInstance.delete(`${baseUrl}/forum/${id}`);
    revalidatePath("/");
    return {
      success: true,
      message: "Forum deleted successfully!",
      errors: null,
      data,
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      message: "Forum delete failed!",
      errors: {
        general: "An error occurred during forum delete.",
      },
      data: null,
    };
  }
}
