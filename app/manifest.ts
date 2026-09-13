import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Web app manifest — Next.js file convention, served at /manifest.webmanifest.
// Icons are flattened onto the site's bone background (#efe9dd), the same
// treatment app/apple-icon.png already uses, generated from the real
// vilas-mark.webp source (331×331) via sharp — see icon-192.png/icon-512.png
// in /public. The 512 is upscaled from that source; swap both for a real
// high-res export once one exists.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.brand,
    start_url: "/",
    display: "standalone",
    background_color: "#efe9dd",
    theme_color: "#efe9dd",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
