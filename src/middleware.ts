import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
  // Generate request ID if not present
  const requestId = request.headers.get('x-request-id') || uuidv4();

  // Create response with request ID
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);

  // Add request ID to request headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
