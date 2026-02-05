"use client";

import { useLocale, useTranslations } from "next-intl";
import { GcdsFooter } from "@cdssnc/gcds-components-react-ssr";

interface FooterProps {
  /** Display mode: 'full' shows all links, 'compact' shows minimal */
  display?: "full" | "compact";
}

/**
 * GC Design System Footer component
 *
 * Implements the standard Canada.ca footer with:
 * - Government of Canada wordmark
 * - Required links (Terms, Privacy)
 * - Optional contextual/contact links
 */
export function Footer({ display = "full" }: FooterProps) {
  const locale = useLocale();
  const t = useTranslations("footer");

  // Contextual links based on locale
  const contextualLinks = {
    en: "https://www.canada.ca/en/contact.html",
    fr: "https://www.canada.ca/fr/contact.html",
  };

  return (
    <GcdsFooter
      display={display}
      contextualHeading={t("allContacts")}
      contextualLinks={`[{"text": "${t("allContacts")}", "href": "${contextualLinks[locale as keyof typeof contextualLinks]}"}]`}
    />
  );
}
