"use client";

import { useTranslations } from "next-intl";
import { GcdsButton } from "@cdssnc/gcds-components-react-ssr";
import { federatedSignOut } from "@/lib/auth/actions";

/**
 * Sign-out button with bilingual label and federated logout.
 * Terminates both the local session and the IdP session.
 */
export function SignOutButton() {
  const t = useTranslations("auth");

  return (
    <form action={federatedSignOut}>
      <GcdsButton type="submit" buttonRole="secondary" size="small">
        {t("signOut")}
      </GcdsButton>
    </form>
  );
}
