import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL environment variable is not set");
}

/**
 * Catch-all Route Handler that proxies requests from the browser to the backend.
 *
 * Flow:
 * Browser → /api/v1/profile/me (Next.js, same-origin, cookies attach automatically)
 *   → This handler reads access_token from request cookies
 *   → Forwards to BACKEND_URL/api/v1/profile/me with the token
 *   → Returns backend response to browser
 *
 * This solves the cross-domain cookie problem: the browser only ever talks to
 * the Next.js frontend domain. The server-side proxy handles backend auth.
 */

async function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathStr = path.join("/");
  const url = new URL(request.url);

  // pathStr is everything after /api/ in the browser URL.
  // e.g. browser → /api/v1/profile/me  →  pathStr = "v1/profile/me"
  // backend routes are /api/v1/..., so: BACKEND_URL + /api/ + pathStr
  const backendUrl = `${BACKEND_URL}/api/${pathStr}${url.search}`;

  // Read cookies from the incoming browser request
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Build headers to forward to backend
  const headers = new Headers();

  // Forward the access token as a cookie to the backend
  // (backend AuthMiddleware reads access_token from cookies)
  const cookieParts: string[] = [];
  if (accessToken) cookieParts.push(`access_token=${accessToken}`);
  if (refreshToken) cookieParts.push(`refresh_token=${refreshToken}`);
  if (cookieParts.length > 0) {
    headers.set("Cookie", cookieParts.join("; "));
  }

  // Forward content-type if present
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  // Forward the request to the backend
  let backendResponse: Response;
  try {
    backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? await request.blob() : undefined,
    });
  } catch (error) {
    console.error("[API Proxy] Backend fetch error:", error);
    return NextResponse.json(
      { success: false, detail: "Backend service unavailable" },
      { status: 502 }
    );
  }

  // Build the response to send back to the browser
  const response = new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
  });

  // Forward content-type from backend
  const responseContentType = backendResponse.headers.get("content-type");
  if (responseContentType) {
    response.headers.set("Content-Type", responseContentType);
  }

  // Forward any Set-Cookie headers from the backend
  // (e.g., after refresh, backend sets new access_token)
  const setCookieHeaders = backendResponse.headers.getSetCookie();
  for (const cookie of setCookieHeaders) {
    response.headers.append("Set-Cookie", cookie);
  }

  return response;
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handler(request, ctx);
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handler(request, ctx);
}

export async function PUT(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handler(request, ctx);
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handler(request, ctx);
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handler(request, ctx);
}

export async function OPTIONS(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handler(request, ctx);
}
