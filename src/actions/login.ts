"use server";

import { baseUrl } from "@/constants/baseUrl";
import axios from "axios";
import { cookies } from "next/headers";

export async function login(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const { data } = await axios.post(`${baseUrl}/auth`, {
      name,
      email,
      password,
    });
    const cookieStore = await cookies();
    cookieStore.set("token", data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return {
      success: true,
      message: "Registration successful!",
      errors: null,
      data,
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    // Return error state
    return {
      success: false,
      message: "Registration failed. Please try again.",
      errors: {
        general: "An error occurred during registration",
      },
      data: null,
    };
  }
}
