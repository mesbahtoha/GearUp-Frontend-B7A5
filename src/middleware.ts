import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JwtPayload {
  email: string;
  name: string;
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

const customerRoutes = ["/dashboard/customer"];
const providerRoutes = ["/dashboard/provider"];
const adminRoutes = ["/dashboard/admin"];
const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];
const protectedRoutes = ["/dashboard", "/payment-success", "/payment-cancel"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token) {
    const payload = parseJwt(token);
    if (!payload) {
      if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
      return NextResponse.next();
    }

    if (customerRoutes.some((route) => pathname.startsWith(route)) && payload.role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (providerRoutes.some((route) => pathname.startsWith(route)) && payload.role !== "PROVIDER") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (adminRoutes.some((route) => pathname.startsWith(route)) && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/payment-success", "/payment-cancel"],
};
