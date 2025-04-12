import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
  };
}

// Update this type to match the RouteContext from Next.js App Router
export type RouteContext = {
  params: Record<string, string>;
};

// Middleware function for authentication with proper types
export function withAuth(
  handler: (
    req: AuthenticatedRequest,
    context: RouteContext
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: RouteContext) => {
    try {
      const token = request.headers.get("Authorization")?.split(" ")[1];

      if (!token) {
        return NextResponse.json(
          { message: "Unauthorized - No token provided" },
          { status: 401 }
        );
      }

      // Verify and decode the JWT token
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { sub: string; email: string };

      if (!decodedToken.sub || !decodedToken.email) {
        return NextResponse.json(
          { message: "Invalid token payload" },
          { status: 401 }
        );
      }

      // Extend the request with user data
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = {
        id: decodedToken.sub,
        email: decodedToken.email,
      };

      // Call the original handler with the authenticated request and proper context
      return handler(authenticatedRequest, context);
    } catch (error: any) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return NextResponse.json(
          { message: "Invalid or expired token" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { message: "Authentication error", error: error.message },
        { status: 500 }
      );
    }
  };
}