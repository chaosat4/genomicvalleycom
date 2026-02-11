import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/api/rate-limit";
import { handleOptions, withCors } from "@/lib/api/cors";

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

const handler = async (req: NextRequest) => {
  if (req.method === "POST") {
    const ip = getClientIp(req.headers);
    const path = req.nextUrl.pathname;
    const rl = rateLimit(`auth:${ip}:${path}`, { windowMs: 60_000, max: 20 });
    if (!rl.allowed) {
      const res = NextResponse.json(
        { success: false, error: "Too many requests", code: "RATE_LIMITED" },
        { status: 429 }
      );
      res.headers.set("Retry-After", String(rl.retryAfter));
      return withCors(req, res);
    }
  }

  const res = await auth.handler(req);
  return withCors(req, res as NextResponse);
};

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
