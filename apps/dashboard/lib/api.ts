"use client";

import type { ApiEnvelope } from "@vexus/shared";

export class ApiClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_VEXUS_API_URL?.trim();
  const browserOrigin = typeof window !== "undefined" ? window.location.origin : null;
  const fallback = browserOrigin ? `${browserOrigin}/api/v1` : "http://localhost:4000/api/v1";

  if (!configured) {
    return fallback;
  }

  if (configured.startsWith("/")) {
    const relative = configured.endsWith("/") ? configured.slice(0, -1) : configured;
    return browserOrigin ? `${browserOrigin}${relative}` : relative;
  }

  return configured.endsWith("/") ? configured.slice(0, -1) : configured;
}

function buildUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return text ? { message: text } : null;
  }

  return response.json();
}

async function performRequest<T>(
  path: string,
  init: RequestInit = {},
  retryOnUnauthorized = true
): Promise<T> {
  const headers = new Headers(init.headers);
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;

  if (!headers.has("Content-Type") && init.body && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    credentials: "include",
    headers
  });

  if (response.status === 401 && retryOnUnauthorized && !path.startsWith("/auth/")) {
    const refreshResponse = await fetch(buildUrl("/auth/refresh"), {
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    if (refreshResponse.ok) {
      return performRequest<T>(path, init, false);
    }
  }

  const payload = await parseResponse(response);

  if (!response.ok) {
    const errorPayload = payload as
      | {
          error?: {
            code?: string;
            message?: string;
            details?: unknown;
          };
          message?: string;
        }
      | null;

    throw new ApiClientError(
      response.status,
      errorPayload?.error?.message ?? errorPayload?.message ?? "Request failed.",
      errorPayload?.error?.code,
      errorPayload?.error?.details
    );
  }

  const envelope = payload as ApiEnvelope<T>;
  return envelope && typeof envelope === "object" && "data" in envelope ? envelope.data : (payload as T);
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  return performRequest<T>(path, init);
}

export async function apiPost<T>(
  path: string,
  body?: Record<string, unknown> | undefined
): Promise<T> {
  return apiRequest<T>(path, {
    body: body ? JSON.stringify(body) : undefined,
    method: "POST"
  });
}

export async function apiPatch<T>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  return apiRequest<T>(path, {
    body: JSON.stringify(body),
    method: "PATCH"
  });
}

export async function apiDelete<T>(path: string): Promise<T> {
  return apiRequest<T>(path, {
    method: "DELETE"
  });
}
