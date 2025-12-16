/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "res.cloudinary.com", // Cloudinary CDN
      "images.unsplash.com", // Unsplash
      "via.placeholder.com", // Placeholder images
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
