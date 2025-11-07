import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack 비활성화를 위해 webpack 사용
  webpack: (config, { isServer }) => {
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
