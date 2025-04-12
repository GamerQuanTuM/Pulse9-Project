import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
  };
}

// Middleware function for authentication
export function withAuth(
  handler: (
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => Promise<NextResponse>
) {
  return async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const token = request.headers.get("Authorization")?.split(" ")[1];
      const parameters = await params;

      if (!parameters || !parameters.id) {
        return NextResponse.json(
          { message: "Id is required" },
          { status: 400 }
        );
      }

      if (!token) {
        return NextResponse.json(
          { message: "Unauthorized - No token provided" },
          { status: 401 }
        );
      }

      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { sub: string; email: string };

      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = {
        id: decodedToken.sub,
        email: decodedToken.email,
      };

      return handler(authenticatedRequest, { params });
    } catch (error: any) {
      return NextResponse.json(
        { message: "Authentication error", error: error.message },
        { status: 500 }
      );
    }
  };
}
