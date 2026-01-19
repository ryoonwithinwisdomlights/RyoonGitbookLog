import type { NextConfig } from "next";
import { BLOG } from "./blog.config";
import path from "path";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: BLOG.BUNDLE_ANALYZER,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Prevent Next.js from mis-detecting workspace root due to external lockfiles.
  outputFileTracingRoot: path.join(__dirname),
  eslint: {
    ignoreDuringBuilds: true,
  },
  // output: process.env.EXPORT ? "export" : undefined,
  // for self-hosting
  output: "standalone",
  staticPageGenerationTimeout: 120,
  images: {
    // Image compression
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gravatar.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "p1.qhimg.com",
      },
      {
        protocol: "https",
        hostname: "ko-fi.com",
      },
      { protocol: "https", hostname: "abs.twimg.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "camo.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "github.githubassets.com",
      },
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/:path*.html",
        destination: "/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/record",
        destination: "/general",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*{/}?",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
      // Static assets caching - immutable for hashed files
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Image caching
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      // Font caching
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  webpack: (config, { dev: _dev, isServer }) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    if (process.env.NODE_ENV_API === "development") {
      config.devtool = "source-map";
    }

    // Silence a known Webpack warning emitted by Sentry/OpenTelemetry's
    // `require-in-the-middle` (dynamic require prevents static extraction).
    // This keeps other warnings visible.
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      (warning: any) => {
        const message: string | undefined = warning?.message;
        if (
          typeof message !== "string" ||
          !message.includes(
            "Critical dependency: require function is used in a way in which dependencies cannot be statically extracted"
          )
        ) {
          return false;
        }

        const mod = warning?.module;
        const resource: string | undefined = mod?.resource;
        const identifier: string | undefined = mod?.identifier;

        return (
          (typeof resource === "string" &&
            resource.includes("require-in-the-middle")) ||
          (typeof identifier === "string" &&
            identifier.includes("require-in-the-middle"))
        );
      },
    ];

    if (!isServer) {
      config.resolve.fallback = {
        fs: false, // 클라이언트 번들에서 fs 제거
      };
      config.externals = {
        ...config.externals,
        "@headlessui/react": "@headlessui/react", // 서버 번들에서 제외
      };
    }

    return config;
  },
  experimental: {
    scrollRestoration: true,
    // App Router: Critters-based optimizeCss isn't compatible with streaming.
    // inlineCss removes the extra CSS request in production by inlining styles.
    // Trade-off: some duplication in HTML/RSC payload.
    inlineCss: true,
    optimizePackageImports: [
      // Icons
      "lucide-react",
      "@radix-ui/react-icons",
      // Radix UI components
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
      "@radix-ui/react-toggle-group",
      // Utilities
      "lodash.throttle",
      "lodash.debounce",
      // Third-party
      "react-share",
      "motion",
      "react-notion-x",
      "notion-utils",
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
