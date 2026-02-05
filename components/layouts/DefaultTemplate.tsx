"use client";

import { GcdsWrapper, Header, Footer } from "@/components/gcds";

interface DefaultTemplateProps {
  children: React.ReactNode;
  /** Navigation items for the header */
  navItems?: {
    href: string;
    labelKey: string;
  }[];
}

/**
 * Default Canada.ca layout template
 *
 * Implements the standard Canada.ca page structure:
 * - GC Header with language toggle and navigation
 * - Main content area
 * - GC Footer with required links
 */
export function DefaultTemplate({
  children,
  navItems = [
    { href: "/", labelKey: "home" },
  ],
}: DefaultTemplateProps) {
  return (
    <GcdsWrapper>
      <Header navItems={navItems} />
      <main id="main-content" className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </GcdsWrapper>
  );
}
