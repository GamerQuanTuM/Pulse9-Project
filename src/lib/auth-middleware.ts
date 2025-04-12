import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
  }
}

// Define the correct RouteContext type to match Next.js expectations
type RouteContext = {
  params: { [key: string]: string | string[] }
}

// Middleware function for authentication
export function withAuth(handler: (req: AuthenticatedRequest, context: RouteContext) => Promise<NextResponse>) {
  return async (request: NextRequest, context: RouteContext) => {
    try {
      const token = request.headers.get("Authorization")?.split(" ")[1]

      if (!token) {
        return NextResponse.json({ message: "Unauthorized - No token provided" }, { status: 401 })
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { sub: string; email: string }

      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = {
        id: decodedToken.sub,
        email: decodedToken.email,
      }

      return handler(authenticatedRequest, context)
    } catch (error: any) {
      return NextResponse.json({ message: "Authentication error", error: error.message }, { status: 500 })
    }
  }
}
