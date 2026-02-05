import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Transpile GCDS packages for SSR compatibility
  transpilePackages: [
    "@cdssnc/gcds-components-react-ssr",
    "@stencil/core",
  ],

  // Allow images from Canada.ca domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.canada.ca",
      },
      {
        protocol: "https",
        hostname: "*.gc.ca",
      },
    ],
  },

  // Security headers are handled in middleware
  // Additional headers can be configured here if needed
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
      ],
    },
  ],
};

export default withNextIntl(nextConfig);
