"use server";

import { baseUrl } from "@/constants/baseUrl";
import axios from "axios";

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
