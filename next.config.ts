import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/resumes/:path*",
        headers: [
          {
            key: "Content-Type",
            value: "application/pdf",
          },
        ],
      },
    ]
  },
}

export default nextConfig
