import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Remove middleware for now to debug authentication
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};