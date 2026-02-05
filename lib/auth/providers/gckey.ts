/**
 * GCKey OIDC provider stub for Government of Canada applications.
 *
 * GCKey is the Government of Canada's Credential Broker Service (CBS)
 * that provides a secure, privacy-respecting authentication mechanism
 * for citizens accessing government services.
 *
 * This is a stub implementation. When GCKey OIDC is available,
 * update with actual issuer and configuration details.
 *
 * Required environment variables:
 * - GCKEY_ISSUER: GCKey OIDC issuer URL
 * - GCKEY_CLIENT_ID: Application client ID registered with GCKey
 * - GCKEY_CLIENT_SECRET: Client secret from GCKey registration
 */

import type { OIDCConfig } from "next-auth/providers";

interface GCKeyProfile {
  sub: string;
  // GCKey provides limited profile information to protect privacy
  // PAI (Persistent Anonymous Identifier) is the primary identifier
}

export const gcKeyProvider: OIDCConfig<GCKeyProfile> = {
  id: "gckey",
  name: "GCKey",
  type: "oidc",
  issuer: process.env.GCKEY_ISSUER,
  clientId: process.env.GCKEY_CLIENT_ID,
  clientSecret: process.env.GCKEY_CLIENT_SECRET,
  authorization: {
    params: {
      scope: "openid",
      // GCKey uses a limited scope to protect citizen privacy
    },
  },
  profile(profile) {
    return {
      // GCKey provides a Persistent Anonymous Identifier (PAI)
      // rather than personal information
      id: profile.sub,
      name: null, // GCKey does not provide name by default
      email: null, // GCKey does not provide email by default
      image: null,
      roles: ["citizen"], // Default role for GCKey users
    };
  },
};
