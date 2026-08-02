import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
   experimental: {
    proxyClientMaxBodySize: "50mb",
   },
  async rewrites(){
     return [
        {
            source: '/api/:path*',
            destination: 'http://localhost:5000/:path*'
        }
     ]
  }
};

export default nextConfig;


