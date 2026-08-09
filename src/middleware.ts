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
const protectedRoutes = ["/dashboard", "/payment-success", "/payment-cancel"];

function isTokenValid(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload) return false;
  if (payload.exp && payload.exp * 1000 < Date.now()) return false;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const validToken = !!token && isTokenValid(token);
  const payload = validToken && token ? parseJwt(token) : null;

  // Auth pages (login/register) are always reachable so users can
  // switch accounts (e.g. sign in with a different Google account).
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !validToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (validToken) {
    if (customerRoutes.some((route) => pathname.startsWith(route)) && payload!.role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (providerRoutes.some((route) => pathname.startsWith(route)) && payload!.role !== "PROVIDER") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (adminRoutes.some((route) => pathname.startsWith(route)) && payload!.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/payment-success", "/payment-cancel"],
};
