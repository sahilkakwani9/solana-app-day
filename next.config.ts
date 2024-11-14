import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "drive.google.com",
      "drive.usercontent.google.com",
      "placehold.co",
      "ik.imagekit.io",
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
