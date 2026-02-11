"use server";

import { signOut } from "@/auth";

/**
 * Sign out with federated logout via Entra ID end_session_endpoint.
 *
 * Clears the local Auth.js session then redirects the browser to the
 * Microsoft Entra ID logout endpoint, which terminates the IdP session
 * and redirects back to the application.
 *
 * Reference: ITSG-33 AC-12 (Session Termination)
 */
export async function federatedSignOut() {
  const tenantId = process.env.AZURE_AD_TENANT_ID;
  const appUrl = process.env.AUTH_URL || "http://localhost:3000";
  const postLogoutRedirectUri = encodeURIComponent(appUrl);

  if (tenantId) {
    // Federated logout: clear local session, then redirect to Entra ID logout
    await signOut({
      redirectTo: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutRedirectUri}`,
    });
  } else {
    // Fallback: local-only logout (e.g., GCKey or missing tenant config)
    await signOut({ redirectTo: appUrl });
  }
}
