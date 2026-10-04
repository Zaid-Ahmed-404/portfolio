import type { NextConfig } from "next";

const basePath = process.env.NODE_ENV === "production" ? "/portfolio" : "";

const nextConfig: NextConfig = {
  // GitHub Pages: fully static output in ./out, served from /portfolio
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  // three.js ships as ESM with many named exports; these keep the client
  // bundles lean by importing only what each module actually uses.
  experimental: {
    optimizePackageImports: ["three", "@react-three/drei", "@react-three/postprocessing", "framer-motion", "gsap"],
  },
};

export default nextConfig;
