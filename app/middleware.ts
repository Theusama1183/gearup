import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware function
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const isAuthenticated = checkAuthentication(request);

  if (!isAuthenticated) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

function checkAuthentication(request: NextRequest): boolean {
  const authCookie = request.cookies.get("auth-token");
  return Boolean(authCookie);
}

export const config = {
  matcher: ["/protected/**", "/dashboard/**"],
};
