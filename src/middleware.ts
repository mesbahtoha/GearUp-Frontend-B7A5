import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];

const roleBasedRoutes: Record<string, string[]> = {
  ADMIN: ["/dashboard/admin"],
  CUSTOMER: ["/dashboard/customer"],
  PROVIDER: ["/dashboard/provider"],
};

function decodeToken(token: string): { role?: string } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const tokenData = accessToken ? decodeToken(accessToken) : null;
  const role = tokenData?.role;

  const isProtectedRoute = pathname.startsWith("/dashboard");

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isProtectedRoute && role) {
    const allowedPrefixes = roleBasedRoutes[role] || [];
    const isAllowed = allowedPrefixes.some((prefix) =>
      pathname.startsWith(prefix)
    );

    if (pathname === "/dashboard" && allowedPrefixes.length > 0) {
      return NextResponse.redirect(
        new URL(allowedPrefixes[0], request.url)
      );
    }

    if (!isAllowed && !allowedPrefixes.some((p) => pathname.startsWith(p))) {
      const firstAllowed = roleBasedRoutes[role]?.[0] || "/dashboard";
      return NextResponse.redirect(new URL(firstAllowed, request.url));
    }
  }

  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute && accessToken) {
    if (role && roleBasedRoutes[role]) {
      return NextResponse.redirect(
        new URL(roleBasedRoutes[role][0], request.url)
      );
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
