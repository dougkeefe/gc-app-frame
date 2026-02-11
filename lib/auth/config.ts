import type { NextAuthConfig } from "next-auth";
import { azureAdProvider } from "./providers/azure-ad";
import type { Role } from "./rbac";

// Extend the default session and JWT types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles: Role[];
    };
  }

  interface User {
    roles?: Role[];
  }
}

/**
 * Auth.js v5 configuration for Government of Canada applications
 */
export const authConfig: NextAuthConfig = {
  providers: [
    azureAdProvider,
    // Add gcKeyProvider when GCKey OIDC is available:
    // gcKeyProvider,
  ],

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  callbacks: {
    /**
     * JWT callback - runs when JWT is created or updated
     */
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id ?? token.sub ?? "";
        token.roles = (user.roles as Role[]) ?? ["user"];
      }

      // Store provider info if needed
      if (account) {
        token.provider = account.provider;
      }

      return token;
    },

    /**
     * Session callback - controls what's exposed to the client
     */
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.roles = token.roles as Role[];
      return session;
    },

    /**
     * Authorized callback - controls access to protected routes
     * Used by middleware to check authentication
     */
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      // Public routes that don't require authentication
      const publicRoutes = ["/", "/login", "/auth/error"];
      const isPublicRoute = publicRoutes.some(
        (route) =>
          pathname === route ||
          pathname.startsWith("/en" + route) ||
          pathname.startsWith("/fr" + route)
      );

      // Splash page is always public
      if (pathname === "/" || pathname === "/en" || pathname === "/fr") {
        return true;
      }

      if (isPublicRoute) {
        return true;
      }

      // API routes have their own auth handling
      if (pathname.startsWith("/api/")) {
        return true;
      }

      // Protect all other routes
      return isLoggedIn;
    },

    /**
     * Redirect callback - controls allowed redirect targets.
     * Permits federated logout to Entra ID while blocking other external URLs.
     */
    redirect({ url, baseUrl }) {
      // Allow federated logout redirect to Entra ID
      if (url.startsWith("https://login.microsoftonline.com/")) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  session: {
    strategy: "jwt",
    // Session expires after 8 hours (GC standard for sensitive applications)
    maxAge: 8 * 60 * 60,
  },

  // Explicit cookie security flags per ITSG-33 SC-8, SC-23
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax", // 'lax' required for OIDC redirect flow
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  // Enable debug mode in development
  debug: process.env.NODE_ENV === "development",
};
