"use client";

import { GcdsWrapper, Header, Footer, DateModified } from "@/components/gcds";

interface DefaultTemplateProps {
  children: React.ReactNode;
  /** Navigation items for the header */
  navItems?: {
    href: string;
    labelKey: string;
  }[];
  /** Last modified date in YYYY-MM-DD format */
  dateModified?: string;
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
  dateModified,
}: DefaultTemplateProps) {
  return (
    <GcdsWrapper>
      <Header navItems={navItems} />
      <main id="main-content" className="container mx-auto px-4 py-8">
        {children}
        {dateModified && <DateModified date={dateModified} />}
      </main>
      <Footer />
    </GcdsWrapper>
  );
}
