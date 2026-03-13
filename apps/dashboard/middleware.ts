import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { authCookieNames } from "@vexus/shared";

const protectedPrefixes = [
  "/overview",
  "/agents",
  "/channels",
  "/sessions",
  "/memory",
  "/skills",
  "/automations",
  "/logs",
  "/settings",
  "/billing",
  "/webchat-preview"
];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(authCookieNames.accessToken)?.value;
  const refreshToken = request.cookies.get(authCookieNames.refreshToken)?.value;
  const hasSessionCookies = Boolean(accessToken || refreshToken);
  const { pathname } = request.nextUrl;

  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix)) && !hasSessionCookies) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && hasSessionCookies) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"]
};
