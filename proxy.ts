// proxy.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/register",
];

const PUBLIC_PREFIXES = [
  "/api/auth",   // NextAuth
  "/_next",      // Next.js internals
  "/favicon.ico",
  "/assets",
  "/public",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Allow exact public pages
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Allow public prefixes
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 🔐 Check NextAuth session cookie
  const sessionToken =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  // ❌ Not authenticated → redirect
  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname); // optional redirect
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next(); 
}
