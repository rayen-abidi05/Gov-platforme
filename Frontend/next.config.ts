import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  experimental: {
    proxyClientMaxBodySize: "50mb",
  },

  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:5000/:path*",
      },
    ];
  },
};

export default nextConfig;