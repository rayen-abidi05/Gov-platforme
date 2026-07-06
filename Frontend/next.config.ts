import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

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
