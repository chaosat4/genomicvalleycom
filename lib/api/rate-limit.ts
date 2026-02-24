type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") || "unknown";
}

export function rateLimit(key: string, options: RateLimitOptions): { allowed: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.max - 1, retryAfter: Math.ceil(options.windowMs / 1000) };
  }

  if (existing.count >= options.max) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  store.set(key, existing);
  return {
    allowed: true,
    remaining: options.max - existing.count,
    retryAfter: Math.ceil((existing.resetAt - now) / 1000),
  };
}
