"use server";

import { baseUrl } from "@/constants/baseUrl";
import serverAxiosInstance from "@/lib/server-axios";

export async function getSinglePost(id: string) {
  try {
    const { data } = await serverAxiosInstance.get(`${baseUrl}/post/${id}`);
    return {
      success: true,
      message: "Post fetched successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      success: false,
      message: "Failed to fetch post",
      data: null,
    };
  }
}