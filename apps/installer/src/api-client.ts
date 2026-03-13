type RequestOptions = {
  body?: unknown;
  headers?: Record<string, string>;
  method?: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
};

export class ApiClientError extends Error {
  status: number;
  code: string;
  details: unknown;

  constructor(message: string, status: number, code = "API_ERROR", details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details ?? null;
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

export class InstallerApiClient {
  private readonly baseUrl: string;
  private readonly cookies = new Map<string, string>();

  constructor(baseUrl: string) {
    this.baseUrl = normalizeBaseUrl(baseUrl);
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: "POST", body });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: "PUT", body });
  }

  private resolveUrl(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    return `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }

  private buildCookieHeader(): string | undefined {
    const entries = Array.from(this.cookies.entries()).map(([name, value]) => `${name}=${value}`);
    return entries.length ? entries.join("; ") : undefined;
  }

  private storeCookies(response: Response): void {
    const rawCookies =
      typeof response.headers.getSetCookie === "function"
        ? response.headers.getSetCookie()
        : response.headers.get("set-cookie")
          ? [response.headers.get("set-cookie") as string]
          : [];

    rawCookies.forEach((entry) => {
      const first = entry.split(";")[0];
      if (!first) {
        return;
      }
      const separator = first.indexOf("=");
      if (separator <= 0) {
        return;
      }
      const name = first.slice(0, separator).trim();
      const value = first.slice(separator + 1).trim();
      if (name) {
        this.cookies.set(name, value);
      }
    });
  }

  async request<T>(path: string, options: RequestOptions): Promise<T> {
    const headers = new Headers(options.headers ?? {});
    const cookieHeader = this.buildCookieHeader();

    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    }

    let body: string | undefined;
    if (options.body !== undefined) {
      headers.set("content-type", "application/json");
      body = JSON.stringify(options.body);
    }

    const response = await fetch(this.resolveUrl(path), {
      body,
      headers,
      method: options.method
    });

    this.storeCookies(response);

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiClientError(
        payload?.error?.message ?? `Request failed with status ${response.status}.`,
        response.status,
        payload?.error?.code,
        payload?.error?.details
      );
    }

    if (payload && typeof payload === "object" && "data" in payload) {
      return payload.data as T;
    }

    return payload as T;
  }
}
