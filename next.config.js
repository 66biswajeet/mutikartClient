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

  // Image optimization - Updated for Next.js 16
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
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
    formats: ["image/webp", "image/avif"], // Use modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    unoptimized: false,
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    scrollRestoration: true,
  },

  // Production source maps (disabled for smaller bundles)
  productionBrowserSourceMaps: false,

  // Turbopack config (Next.js 16+)
  turbopack: {
    // Empty config to acknowledge Turbopack usage
    // Most optimizations are handled by Turbopack by default
  },
};

module.exports = nextConfig;
