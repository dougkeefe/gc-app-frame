"use client";

import { GcdsWrapper, Header, Footer, DateModified } from "@/components/gcds";

interface AppTemplateProps {
  children: React.ReactNode;
  /** Sidebar content */
  sidebar?: React.ReactNode;
  /** Navigation items for the header */
  navItems?: {
    href: string;
    labelKey: string;
  }[];
  /** Last modified date in YYYY-MM-DD format */
  dateModified?: string;
}

/**
 * Application layout template with sidebar
 *
 * Extends the default Canada.ca layout with:
 * - Optional sidebar for application navigation
 * - Wider content area
 * - Suitable for dashboard/application interfaces
 */
export function AppTemplate({
  children,
  sidebar,
  navItems = [
    { href: "/", labelKey: "home" },
  ],
  dateModified,
}: AppTemplateProps) {
  return (
    <GcdsWrapper>
      <Header navItems={navItems} />
      <div className="flex min-h-screen">
        {sidebar && (
          <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50 p-4">
            <nav aria-label="Application navigation">{sidebar}</nav>
          </aside>
        )}
        <main
          id="main-content"
          className="flex-1 px-6 py-8"
        >
          {children}
          {dateModified && <DateModified date={dateModified} />}
        </main>
      </div>
      <Footer display="compact" />
    </GcdsWrapper>
  );
}
