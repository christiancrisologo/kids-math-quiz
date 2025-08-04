import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Add trailing slash for GitHub Pages compatibility
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Configure base path and asset prefix for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/kids-math-quiz' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/kids-math-quiz/' : '',
};

export default nextConfig;
