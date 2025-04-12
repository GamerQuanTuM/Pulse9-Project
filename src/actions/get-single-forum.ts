"use server";

import serverAxiosInstance from "@/lib/server-axios";

export const getSingleForum = async (id: string) => {
  try {
    const forum = await serverAxiosInstance.get(`/forum/${id}`);
    return {
      success: true,
      data: forum.data.data,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching forum:", error);
    return {
      success: false,
      data: null,
      error: "Failed to fetch forum",
    };
  }
};
