"use server";

import { baseUrl } from "@/constants/baseUrl";
import serverAxiosInstance from "@/lib/server-axios";
import axios from "axios";
import { cookies } from "next/headers";

export async function serverProfile() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return {
        success: false,
        message: "User not authenticated",
        errors: null,
        data: null,
      };
    }

    const { data } = await serverAxiosInstance.get(`/profile`);

    return {
      success: true,
      errors: null,
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      errors: null,
      data: null,
    };
  }
}
