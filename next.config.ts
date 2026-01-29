import type { NextConfig } from "next";

const backendBaseUrl = "http://localhost:8080"
  // process.env.NEXT_PUBLIC_API_URL ??
  // (process.env.NODE_ENV === "development"
  //   ? "http://localhost:8080"
  //   : "https://discovr-backend.onrender.com")

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: `${backendBaseUrl}/auth/:path*`,
      },
      {
        source: "/integrations/:path*",
        destination: `${backendBaseUrl}/integrations/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ]
  },
};

export default nextConfig;
