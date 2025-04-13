import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/auth-middleware";
import { cookies } from "next/headers";

async function logout(request: AuthenticatedRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');

    return NextResponse.json(
      { message: "Success", data: "" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, data: null },
      { status: 500 }
    );
  }
}

export const GET = withAuth(logout);
