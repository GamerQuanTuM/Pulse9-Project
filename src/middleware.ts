import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return handleCORS(new NextResponse(null, { status: 204 }))
  }
  
  // Get token and pathname for auth checks
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/auth']
  
  // If trying to access protected route without token
  if (!publicRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // If trying to access auth route with token
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // For non-redirected requests, add CORS headers and continue
  return handleCORS(NextResponse.next())
}

// Helper function to add CORS headers to responses
function handleCORS(response: NextResponse) {
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', '86400')
  
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}