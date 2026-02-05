"use client";

import { useEffect } from "react";

// Import GCDS styles
import "@cdssnc/gcds-components-react-ssr/gcds.css";

interface GcdsWrapperProps {
  children: React.ReactNode;
}

/**
 * GcdsWrapper component
 *
 * This client component ensures GCDS styles and scripts are loaded.
 * Wrap your application or specific pages with this component to use GCDS.
 */
export function GcdsWrapper({ children }: GcdsWrapperProps) {
  useEffect(() => {
    // GCDS components may need hydration on the client side
    // This ensures web components are properly initialized
    if (typeof window !== "undefined") {
      // Trigger custom element upgrade if needed
      customElements.whenDefined("gcds-header").catch(() => {
        // Component not registered, which is fine for SSR
      });
    }
  }, []);

  return <>{children}</>;
}
