import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /d48's "Copy template code" reads the demo source off disk at request
  // time so what gets copied is always what's live. Without this the files
  // aren't traced into the serverless bundle and the read 404s on Vercel.
  outputFileTracingIncludes: {
    "/d48": ["./components/demos/**/*.tsx"],
  },
};

export default nextConfig;
