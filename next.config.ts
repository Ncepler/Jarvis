import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // placeholder screenshots come from the mshots capture service until
    // real /public/work/*.webp captures exist — remove with the placeholders
    remotePatterns: [
      { protocol: "https", hostname: "image.thum.io", pathname: "/get/**" },
    ],
  },
};

export default nextConfig;
