/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Performance optimizations
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Image optimization
  // unoptimized: true bypasses the Next.js image proxy server entirely.
  // The browser fetches Cloudinary images directly, avoiding the
  // "unable to get local issuer certificate" SSL error caused by the
  // corporate network proxy intercepting outbound HTTPS connections.
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
    ],
  },

  // Experimental features for better performance
  experimental: {
    // optimizeCss: true, // Disabled — requires 'critters' package
    scrollRestoration: true,
  },

  // Production source maps (disabled for smaller bundles)
  productionBrowserSourceMaps: false,

  // Turbopack causes crashes on Windows with Next.js 16 — disabled.
  // Use classic Webpack bundler (the default when 'turbopack' key is absent).

  // Proxy /api/* requests to the backend server so client-side fetches
  // can use relative URLs (e.g. /api/vendor-products) without CORS issues.
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
