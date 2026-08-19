import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Two features read the demo source off disk at request time: /d48's "Copy
  // template code", and /start's customize page, which lifts each template's
  // real content out so a client can edit it in place. Without this the files
  // aren't traced into the serverless bundle and the read 404s on Vercel.
  outputFileTracingIncludes: {
    "/d48": ["./components/demos/**/*.tsx"],
    "/start": ["./components/demos/**/*.tsx"],
  },
};

export default nextConfig;
