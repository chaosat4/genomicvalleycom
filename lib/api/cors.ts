import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function resolveOrigin(origin: string | null): string {
  if (!origin) return allowedOrigins[0] || "http://localhost:3000";
  return allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || "http://localhost:3000";
}

export function withCors(request: NextRequest, response: NextResponse): NextResponse {
  const origin = resolveOrigin(request.headers.get("origin"));
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Vary", "Origin");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

export function handleOptions(request: NextRequest): NextResponse {
  return withCors(request, new NextResponse(null, { status: 204 }));
}
