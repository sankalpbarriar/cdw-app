import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Check session cookie (JWT stored in cookie)
  const token =
    req.cookies.get("next-auth.session-token")?.value ??
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  // CSP nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Set secure headers
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    base-uri 'self';
    object-src 'none';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("x-nonce", nonce);
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Redirect if not authenticated and accessing protected routes
  const protectedPaths = ["/admin", "/challenge"];
  const isProtected = protectedPaths.some((path) => url.pathname.startsWith(path));

  if (!token && isProtected) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return response;
}

// Specify paths that middleware applies to
export const config = {
  matcher: [
    "/admin/:path*",
    "/challenge",
    // Exclude static files and public assets
    "/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|logo.svg).*)",
  ],
};
