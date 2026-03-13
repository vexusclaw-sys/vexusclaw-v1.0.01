import { isIP } from "node:net";

import type { FastifyReply } from "fastify";

import type { VexusEnv } from "@vexus/config";
import { authCookieNames } from "@vexus/shared";

function resolveCookieDomain(domain?: string | null): string | undefined {
  if (!domain || domain === "localhost" || domain === "127.0.0.1" || isIP(domain)) {
    return undefined;
  }

  return domain;
}

function buildCookieOptions(env: VexusEnv) {
  return {
    domain: resolveCookieDomain(env.COOKIE_DOMAIN),
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: env.COOKIE_SECURE
  };
}

export function setAuthCookies(
  reply: FastifyReply,
  env: VexusEnv,
  input: {
    accessToken: string;
    refreshToken: string;
  }
): void {
  const options = buildCookieOptions(env);

  reply.setCookie(authCookieNames.accessToken, input.accessToken, {
    ...options,
    maxAge: env.ACCESS_TOKEN_TTL_MINUTES * 60
  });
  reply.setCookie(authCookieNames.refreshToken, input.refreshToken, {
    ...options,
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60
  });
}

export function clearAuthCookies(reply: FastifyReply, env: VexusEnv): void {
  const options = buildCookieOptions(env);

  reply.clearCookie(authCookieNames.accessToken, options);
  reply.clearCookie(authCookieNames.refreshToken, options);
}
