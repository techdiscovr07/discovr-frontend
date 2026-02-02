import type { NextConfig } from "next";

const isLocalhostUrl = (value: string) => {
  try {
    const parsed = new URL(value)
    return parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1"
  } catch {
    return false
  }
}

const envBackendUrl = process.env.NEXT_PUBLIC_API_URL
const backendBaseUrl =
  // Prevent accidentally shipping a localhost API base URL to production.
  (process.env.NODE_ENV !== "development" &&
  typeof envBackendUrl === "string" &&
  isLocalhostUrl(envBackendUrl)
    ? "https://discovr-backend.onrender.com"
    : envBackendUrl) ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://discovr-backend.onrender.com")

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
