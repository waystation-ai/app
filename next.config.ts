import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse'],
  async redirects() {
    return [
      {
        source: '/marketplace/claude/:path*',
        destination: '/integrations/claude/:path*',
        permanent: true,
      },
      {
        source: '/ai/:path*',
        destination: '/use-cases/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/mcp/:path*",
        destination: "/api/mcp/:path*",
      },
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true, 
};

export default nextConfig;
