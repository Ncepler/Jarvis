import type { NextConfig } from "next";

// The host generated client-site captures live on (Supabase Storage — see
// lib/screenshot.ts / app/api/capture-sites). Parsed from SUPABASE_URL so
// this doesn't need editing if the project ever moves. A manually-pasted
// `screenshot_url` (ClientSites.tsx) renders through a plain <img> instead of
// next/image precisely so it can point anywhere Noah pastes it in, without
// this list needing to know about it.
const supabaseHost = (() => {
  try {
    return process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname : undefined;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  // Two features read the demo source off disk at request time: /d48's "Copy
  // template code", and /start's customize page, which lifts each template's
  // real content out so a client can edit it in place. Without this the files
  // aren't traced into the serverless bundle and the read 404s on Vercel.
  outputFileTracingIncludes: {
    "/d48": ["./components/demos/**/*.tsx"],
    "/start": ["./components/demos/**/*.tsx"],
    // @sparticuz/chromium reads its bundled Chromium binary off disk by a
    // computed path at runtime (app/api/capture-sites), not via a static
    // require/import Next's tracing can follow on its own — without this,
    // the .br binaries silently don't ship and the function 404s trying to
    // read them on Vercel. This is also the file-size risk the ticket's
    // fallback clause is about: the binary alone is ~65MB uncompressed,
    // which may exceed the deployed plan's function size limit even with
    // this include in place — see the route file's top comment.
    "/api/capture-sites": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
};

export default nextConfig;
