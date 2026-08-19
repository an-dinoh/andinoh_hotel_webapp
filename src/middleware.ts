import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected main route prefixes requiring authentication
const protectedRoutes = [
  "/dashboard",
  "/rooms",
  "/bookings",
  "/staff",
  "/reports",
  "/wallet",
  "/settings",
  "/my_hotel",
  "/chats",
  "/notifications",
  "/event-spaces",
  "/help",
];

// Guest auth routes (logged-in users should be redirected away)
const authRoutes = [
  "/login",
  "/register",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("auth_token")?.value;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // 1. Unauthenticated user trying to access protected main route -> Redirect to /login
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user trying to access /login or /register -> Redirect to /dashboard
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (/logos, /icons, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|logos|icons|font).*)",
  ],
};
