/** Two-letter initials for avatar/logo fallbacks (e.g. "Yubhian Tech" -> "YT").
 *  Shared so the identical helper isn't redefined in each component that needs it. */
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Normalises a user-entered website URL for use in an href. Values typed into the
 *  admin often omit the scheme ("example.com"), which a browser would otherwise treat
 *  as a relative path and resolve against the current page. Returns null when there's
 *  nothing usable, so callers can skip rendering a dead link. */
export function externalUrl(raw?: string | null): string | null {
  const value = raw?.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^(mailto:|tel:)/i.test(value)) return value;
  return `https://${value.replace(/^\/+/, "")}`;
}
