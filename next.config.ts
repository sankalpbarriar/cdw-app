import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "*" }],
  },
};

export default nextConfig;
