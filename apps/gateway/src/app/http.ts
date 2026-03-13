import type { FastifyRequest } from "fastify";

import type { ApiEnvelope } from "@vexus/shared";
import { normalizeWorkspaceHost } from "@vexus/shared";

export function apiOk<T>(data: T): ApiEnvelope<T> {
  return { data };
}

export function getAuthorizationToken(request: FastifyRequest): string | null {
  const header = request.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length).trim();
}

export function getRequestIp(request: FastifyRequest): string | undefined {
  const forwardedFor = request.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0]?.trim();
  }

  return request.ip;
}

export function getRequestHost(request: FastifyRequest): string | null {
  const forwardedHost = request.headers["x-forwarded-host"];
  const hostHeader = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost ?? request.headers.host;

  return normalizeWorkspaceHost(hostHeader);
}

export function getRequestProtocol(request: FastifyRequest): "http" | "https" {
  const forwardedProto = request.headers["x-forwarded-proto"];
  const rawForwardedProto = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
  const normalizedForwardedProto = rawForwardedProto?.split(",")[0]?.trim().toLowerCase();

  if (normalizedForwardedProto === "https") {
    return "https";
  }

  if (normalizedForwardedProto === "http") {
    return "http";
  }

  if (request.protocol === "https") {
    return "https";
  }

  return "http";
}

export function getRequestOrigin(request: FastifyRequest): string | null {
  const host = getRequestHost(request);

  if (!host) {
    return null;
  }

  return `${getRequestProtocol(request)}://${host}`;
}
