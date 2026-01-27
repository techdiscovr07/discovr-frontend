import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "https://discovr-backend.onrender.com/auth/:path*",
      },
      {
        source: "/api/:path*",
        destination: "https://discovr-backend.onrender.com/api/:path*",
      },
    ]
  },
};

export default nextConfig;
