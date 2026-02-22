/**
 * Performance Configuration
 * Centralized settings for performance optimizations
 */

export const PERFORMANCE_CONFIG = {
  // Image optimization settings
  images: {
    quality: 85, // Balance between quality and file size
    formats: ["image/webp", "image/avif"],
    lazyLoadOffset: "200px", // Start loading images 200px before viewport
    placeholder: "blur", // Use blur placeholder
    priority: {
      aboveFold: true, // Prioritize above-fold images
      carousel: true, // Prioritize first carousel image
    },
  },

  // Code splitting settings
  codeSplitting: {
    enableLazyLoading: true,
    chunkSize: {
      min: 20000, // Minimum chunk size (20KB)
      max: 500000, // Maximum chunk size (500KB)
    },
  },

  // Cache settings
  cache: {
    staticAssets: 31536000, // 1 year for static assets
    apiResponses: 3600, // 1 hour for API responses
    pages: 0, // No cache for pages (allow bfcache)
    images: 86400, // 1 day for images
  },

  // Font loading strategy
  fonts: {
    display: "swap", // Use font-display: swap
    preload: true, // Preload critical fonts
    subset: "latin", // Load only latin subset
  },

  // Resource hints
  resourceHints: {
    preconnect: [
      "https://res.cloudinary.com", // Cloudinary CDN
    ],
    dnsPrefetch: ["https://res.cloudinary.com"],
  },

  // JavaScript optimization
  javascript: {
    removeConsoleInProduction: true,
    minify: true,
    sourceMaps: false, // Disable in production
    splitChunks: true,
  },

  // CSS optimization
  css: {
    minify: true,
    purge: true, // Remove unused CSS
    critical: false, // Extract critical CSS (future)
  },

  // Monitoring thresholds
  thresholds: {
    lcp: 2500, // Largest Contentful Paint (ms)
    fid: 100, // First Input Delay (ms)
    cls: 0.1, // Cumulative Layout Shift
    fcp: 1800, // First Contentful Paint (ms)
    tti: 3800, // Time to Interactive (ms)
  },
};

/**
 * Get image loading strategy based on position
 * @param {number} index - Image index in list
 * @param {boolean} isAboveFold - Whether image is above the fold
 */
export function getImageLoadingStrategy(index = 0, isAboveFold = false) {
  const shouldPrioritize = index === 0 || isAboveFold;

  return {
    loading: shouldPrioritize ? "eager" : "lazy",
    fetchpriority: shouldPrioritize ? "high" : "low",
    priority: shouldPrioritize,
  };
}

/**
 * Get cache-control header value
 * @param {string} type - Resource type (static, api, page, image)
 */
export function getCacheControl(type = "page") {
  const { cache } = PERFORMANCE_CONFIG;

  switch (type) {
    case "static":
      return `public, max-age=${cache.staticAssets}, immutable`;
    case "api":
      return `public, s-maxage=${cache.apiResponses}, stale-while-revalidate=${cache.apiResponses * 2}`;
    case "image":
      return `public, max-age=${cache.images}, immutable`;
    case "page":
    default:
      return `public, max-age=${cache.pages}, must-revalidate`;
  }
}

/**
 * Check if performance threshold is met
 * @param {string} metric - Performance metric name
 * @param {number} value - Measured value
 */
export function meetsThreshold(metric, value) {
  const threshold = PERFORMANCE_CONFIG.thresholds[metric.toLowerCase()];
  if (!threshold) return true;

  return value <= threshold;
}

export default PERFORMANCE_CONFIG;
