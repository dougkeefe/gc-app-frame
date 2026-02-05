"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  GcdsHeader,
  GcdsTopNav,
  GcdsNavLink,
} from "@cdssnc/gcds-components-react-ssr";

interface HeaderProps {
  /** Navigation items to display */
  navItems?: {
    href: string;
    labelKey: string;
  }[];
}

/**
 * GC Design System Header component
 *
 * Implements the standard Canada.ca header with:
 * - Government of Canada signature
 * - Language toggle
 * - Top navigation
 * - Skip to content link
 */
export function Header({ navItems = [] }: HeaderProps) {
  const t = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();

  // Build the language toggle URL
  const otherLocale = locale === "en" ? "fr" : "en";
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "");
  const langToggleHref = `/${otherLocale}${pathWithoutLocale}`;

  return (
    <GcdsHeader langHref={langToggleHref} skipToHref="#main-content">
      <GcdsTopNav slot="menu" label={tCommon("menu")} alignment="right">
        {navItems.map((item) => (
          <GcdsNavLink key={item.href} href={`/${locale}${item.href}`}>
            {t(item.labelKey)}
          </GcdsNavLink>
        ))}
      </GcdsTopNav>
    </GcdsHeader>
  );
}

/**
 * Simple header without navigation
 * Use for splash pages or minimal layouts
 */
export function SimpleHeader() {
  const locale = useLocale();
  const pathname = usePathname();

  const otherLocale = locale === "en" ? "fr" : "en";
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "");
  const langToggleHref = `/${otherLocale}${pathWithoutLocale}`;

  return <GcdsHeader langHref={langToggleHref} skipToHref="#main-content" />;
}
