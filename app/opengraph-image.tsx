import { ImageResponse } from "next/og";
import { COPY, SITE } from "@/lib/site";

// Placeholder OG image — a plain wordmark card, generated at request time so
// the site has *something* real for og:image instead of nothing. Swap for a
// designed asset once one exists (TODO(name) territory, same as the rest of
// the brand assets — see CLAUDE.md §12). `COPY.hero.positioning` stands in
// for the tagline line since `SITE.tagline` is still `TAGLINE_TBD` — never
// render a raw "_TBD" placeholder string into a public image.
export const alt = `${SITE.name} — web design studio, Long Island, NY`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#EDE7DA",
          color: "#1A1612",
        }}
      >
        <div
          style={{
            fontSize: 104,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          {SITE.name}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            color: "#1A1612",
            opacity: 0.72,
          }}
        >
          {COPY.hero.positioning}
        </div>
      </div>
    ),
    { ...size },
  );
}
