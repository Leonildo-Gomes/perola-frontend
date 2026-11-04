import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  // Same-origin proxy to the Spring Boot API: the browser calls /api/v1/* on the Next origin,
  // so no CORS is needed in dev. Set NEXT_PUBLIC_API_URL to bypass it (backend must then allow CORS).
  async rewrites() {
    const backend = (process.env.BACKEND_URL ?? "http://localhost:8080").replace(/\/$/, "");
    return [{ source: "/api/v1/:path*", destination: `${backend}/api/v1/:path*` }];
  },
};

export default nextConfig;

