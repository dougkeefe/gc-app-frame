import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/config";
import { auth } from "@/auth";

// Create the i18n middleware
const intlMiddleware = createMiddleware(routing);

// Security headers for GC compliance
const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  // Content Security Policy - adjust as needed for your application
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // May need adjustment for GCDS
    "style-src 'self' 'unsafe-inline'", // Required for GCDS
    "img-src 'self' data: https://www.canada.ca https://*.gc.ca",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

// Apply security headers to response
function applySecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Routes that require admin role
const adminRoutes = ["/admin", "/dashboard/admin"];

// Public routes that don't require authentication
const publicPaths = ["/", "/login", "/auth", "/api/auth"];

function isPublicPath(pathname: string): boolean {
  // Root paths and splash page
  if (pathname === "/" || pathname === "/en" || pathname === "/fr") {
    return true;
  }

  // Check for public paths with or without locale prefix
  return publicPaths.some(
    (path) =>
      pathname === path ||
      pathname.startsWith(`/en${path}`) ||
      pathname.startsWith(`/fr${path}`)
  );
}

function isAdminPath(pathname: string): boolean {
  return adminRoutes.some(
    (path) =>
      pathname === path ||
      pathname.startsWith(`/en${path}`) ||
      pathname.startsWith(`/fr${path}`)
  );
}

export default auth(async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes (except auth)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Handle i18n routing
  const response = intlMiddleware(request);

  // Apply security headers
  applySecurityHeaders(response);

  // Get session from auth
  const session = (request as unknown as { auth: unknown }).auth;

  // Check if route requires admin access
  if (isAdminPath(pathname)) {
    if (!session) {
      // Redirect to login
      const locale = pathname.startsWith("/fr") ? "fr" : "en";
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    // Check for admin role
    const userRoles =
      (session as { user?: { roles?: string[] } })?.user?.roles ?? [];
    if (!userRoles.includes("admin")) {
      // Redirect to access denied page
      const locale = pathname.startsWith("/fr") ? "fr" : "en";
      return NextResponse.redirect(
        new URL(`/${locale}/access-denied`, request.url)
      );
    }
  }

  // Check authentication for protected routes
  if (!isPublicPath(pathname) && !session) {
    const locale = pathname.startsWith("/fr") ? "fr" : "en";
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
});

export const config = {
  // Match all pathnames except static files
  matcher: ["/((?!_next|.*\\..*).*)"],
};
