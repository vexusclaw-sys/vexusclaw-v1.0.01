const reservedWorkspaceSlugs = new Set([
  "api",
  "app",
  "dashboard",
  "admin",
  "root",
  "setup",
  "www"
]);

function trimDots(value: string): string {
  return value.replace(/^\.+|\.+$/g, "");
}

export function normalizeWorkspaceHost(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const firstValue = value.split(",")[0]?.trim().toLowerCase();

  if (!firstValue) {
    return null;
  }

  const withoutPort = firstValue.replace(/:\d+$/, "");
  return trimDots(withoutPort) || null;
}

export function isReservedWorkspaceSlug(value: string): boolean {
  return reservedWorkspaceSlugs.has(value.toLowerCase());
}

export function buildWorkspaceHostname(slug: string, baseDomain: string): string {
  return `${trimDots(slug)}.${trimDots(baseDomain)}`;
}

export function buildWorkspacePublicUrl(input: {
  slug?: string | null;
  hostname?: string | null;
  baseDomain: string;
  protocol?: "http" | "https";
}): string | null {
  const protocol = input.protocol ?? "https";
  const hostname =
    input.hostname ??
    (input.slug ? buildWorkspaceHostname(input.slug, input.baseDomain) : null);

  if (!hostname) {
    return null;
  }

  return `${protocol}://${hostname}`;
}

export function extractWorkspaceSlugFromHost(
  host: string | null | undefined,
  baseDomain: string
): string | null {
  const normalizedHost = normalizeWorkspaceHost(host);
  const normalizedBaseDomain = normalizeWorkspaceHost(baseDomain);

  if (!normalizedHost || !normalizedBaseDomain) {
    return null;
  }

  if (normalizedHost === normalizedBaseDomain) {
    return null;
  }

  const suffix = `.${normalizedBaseDomain}`;

  if (!normalizedHost.endsWith(suffix)) {
    return null;
  }

  const candidate = normalizedHost.slice(0, -suffix.length);

  if (!candidate || candidate.includes(".") || isReservedWorkspaceSlug(candidate)) {
    return null;
  }

  return candidate;
}

export function isLocalWorkspaceHost(host: string | null | undefined): boolean {
  const normalizedHost = normalizeWorkspaceHost(host);

  if (!normalizedHost) {
    return false;
  }

  return (
    normalizedHost === "localhost" ||
    normalizedHost === "127.0.0.1" ||
    normalizedHost === "[::1]"
  );
}
