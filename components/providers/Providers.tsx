"use client";

import { AuthProvider } from "./AuthProvider";
import type { Session } from "next-auth";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

/**
 * Root providers component
 *
 * Wraps the application with all necessary providers:
 * - AuthProvider (NextAuth SessionProvider)
 * - Add additional providers here as needed (e.g., theme, query client)
 */
export function Providers({ children, session }: ProvidersProps) {
  return <AuthProvider session={session}>{children}</AuthProvider>;
}
