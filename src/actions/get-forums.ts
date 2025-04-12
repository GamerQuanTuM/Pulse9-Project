"use server";
import serverAxiosInstance from "@/lib/server-axios";

export async function getForums() {
  try {

    const forums = await serverAxiosInstance.get("/forum");
    return {
      success: true,
      data: forums.data.data,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching forums:", error);
    return {
      success: false,
      data: null,
      error: "Failed to fetch forums",
    };
  }
}
