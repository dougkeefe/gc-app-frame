import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import type { Role } from "../rbac";

/**
 * Azure AD / Microsoft Entra ID provider configuration
 * for Government of Canada applications.
 *
 * Required environment variables:
 * - AZURE_AD_CLIENT_ID: Application (client) ID from Azure portal
 * - AZURE_AD_CLIENT_SECRET: Client secret from Azure portal
 * - AZURE_AD_TENANT_ID: Directory (tenant) ID from Azure portal
 */
export const azureAdProvider = MicrosoftEntraID({
  clientId: process.env.AZURE_AD_CLIENT_ID!,
  clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
  issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
  authorization: {
    params: {
      // Minimal scopes per Privacy Act / ITSG-33 AC-6 (Least Privilege)
      // Only add User.Read if Microsoft Graph /me endpoint is needed
      scope: "openid profile email",
    },
  },
  profile(profile) {
    // Map Azure AD roles to application roles
    const azureRoles = (profile.roles as string[] | undefined) ?? [];
    const roles: Role[] = azureRoles.length > 0
      ? azureRoles.filter((r): r is Role =>
          ["admin", "manager", "user", "citizen", "guest"].includes(r)
        )
      : ["user"];

    return {
      id: profile.sub,
      name: profile.name ?? null,
      email: profile.email ?? null,
      image: null,
      roles,
    };
  },
});
