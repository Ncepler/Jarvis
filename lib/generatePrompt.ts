// Turns one intake_submissions row into the build prompt Noah pastes into a
// fresh Claude session. Pure — no fetching, no React, no env — so the wording
// can be edited here without touching the /d48 UI that calls it.

import { templateByKey } from "./templates";
import type { SubmissionRow } from "./intake";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

// Every optional line goes through here: a missing field drops the whole
// line rather than printing "N/A".
const line = (label: string, v: unknown) => {
  const s = str(v);
  return s ? `- ${label}: ${s}` : null;
};

const join = (parts: (string | null)[]) => parts.filter(Boolean).join("\n");

function hoursBlock(hours: unknown) {
  if (!Array.isArray(hours) || hours.length === 0) return null;
  const rows = hours
    .map((h) => {
      if (!h || typeof h !== "object") return null;
      const { day, closed, open, close } = h as Record<string, unknown>;
      if (!day) return null;
      return `  - ${day}: ${closed ? "closed" : `${open} to ${close}`}`;
    })
    .filter(Boolean);
  return rows.length ? `- Hours:\n${rows.join("\n")}` : null;
}

function socialsBlock(row: SubmissionRow) {
  const rows = (
    [
      ["Instagram", row.instagram],
      ["Facebook", row.facebook],
      ["Google Business", row.google_business],
    ] as const
  )
    .filter(([, v]) => str(v))
    .map(([label, v]) => `  - ${label}: ${str(v)}`);
  return rows.length ? `- Social links:\n${rows.join("\n")}` : null;
}

function photosBlock(photos: unknown) {
  if (!Array.isArray(photos) || photos.length === 0) return null;
  const rows = photos
    .map((p) => {
      if (!p || typeof p !== "object") return null;
      const { name, url } = p as Record<string, unknown>;
      return `  - ${str(name)}: ${str(url)}`;
    })
    .filter(Boolean);
  return rows.length ? `- Photos uploaded (already named to indicate placement):\n${rows.join("\n")}` : null;
}

// The {templateSpecificSection}: the chosen template's own question set,
// with whatever the client answered. Unanswered questions are dropped.
function templateSection(row: SubmissionRow) {
  if (row.is_custom_build) {
    return "No template. This is a custom build, so there are no template-specific answers. Everything comes from the sections above and the brain dump below.";
  }
  const tpl = templateByKey(str(row.template_choice));
  if (!tpl) return "No template recorded on this submission.";

  const answers = (row.template_customizations ?? {}) as Record<string, unknown>;
  const rows = tpl.questions
    .map((q) => {
      const a = str(answers[q.key]);
      return a ? `- ${q.label}: ${a}` : null;
    })
    .filter(Boolean);

  const head = `Template: ${tpl.name} (${tpl.file}, sample business "${tpl.sample}").`;
  return rows.length
    ? `${head}\n\n${rows.join("\n")}`
    : `${head}\n\nThe client left every template-specific question blank. Keep the template's own structure and personalize it from the business info above.`;
}

function contextBlock(row: SubmissionRow) {
  if (row.is_custom_build) {
    return `This is a custom build with no template underneath it. There is no starting file to read. Design it around this specific business from the ground up, using components/demos/RenovationDemo.tsx as a quality bar rather than a starting point, and .claude/skills/local-service-design-system/SKILL.md as the design system.`;
  }
  const tpl = templateByKey(str(row.template_choice));
  const file = tpl?.file ?? `components/demos/${str(row.template_choice)}.tsx`;
  const name = tpl?.name ?? str(row.template_choice);
  return `This build uses the ${name} template as its foundation. Read ${file} first, that's the starting point. Personalize it thoroughly. Every section, copy, color, image, and layout choice should reflect this specific business. It should not look like the template with a name swapped in.`;
}

export function generatePrompt(row: SubmissionRow): string {
  const name = str(row.business_name) || "this business";
  const type = str(row.business_type);
  const where = str(row.address);
  const opener = `Build a website for ${name}${type ? `, a ${type}` : ""}${where ? ` based in ${where}` : ""}.`;

  const palette =
    row.palette_choice === "own"
      ? join([
          line("Palette choice", "the client's own colors"),
          line("Main color", row.main_color),
          line("Accent", row.accent_color),
        ])
      : row.is_custom_build
        ? "- Palette choice: none given. Pick one that suits the business."
        : "- Palette choice: keep the template's existing palette as-is.";

  const hasLogo = Boolean(str(row.main_logo_url) || str(row.profile_logo_url));
  const hasPhotos = Array.isArray(row.photo_urls) && row.photo_urls.length > 0;

  return [
    opener,
    "",
    "## Context",
    contextBlock(row),
    "",
    "## Business info",
    join([
      line("Name", row.business_name),
      line("Type of business", row.business_type),
      line("Contact person", row.your_name),
      line("Business email (where their contact form should send to)", row.business_email),
      line("Phone", row.phone),
      line("Address", row.address),
      line("Domain they want", row.desired_domain),
    ]),
    "",
    "## Brand",
    join([
      palette,
      line("Main logo file", row.main_logo_url),
      line("Profile logo (cropped square, use for favicon and any circular placements)", row.profile_logo_url),
      line("Profile logo, uncropped original", row.profile_logo_original_url),
    ]),
    "",
    hasLogo
      ? "Logo integration note: this logo must feel like part of the design. Do not slap it in the header and call it done. Consider color echoes, negative space around it, size proportional to nav elements, and any places it can reappear (footer, loading state, and so on). If the logo has a distinctive shape, use that shape as a visual motif elsewhere on the site where appropriate."
      : "No logo was uploaded. Set the business name in type rather than inventing a mark, and pick a face that carries the same weight a logo would.",
    "",
    "## Content",
    join([
      line("Services/products", row.services),
      hoursBlock(row.hours),
      socialsBlock(row),
      photosBlock(row.photo_urls),
      line("Hero video", row.hero_video_url),
    ]),
    "",
    hasPhotos
      ? "Client instructions for photo placement: match each uploaded photo's filename to the corresponding slot in the template. Filenames indicate intent."
      : "No photos were uploaded. Leave the template's labeled placeholders in place at the right aspect ratios rather than substituting stock or generated images, and list what's still needed in your report.",
    "",
    "## Template-specific customizations",
    templateSection(row),
    "",
    ...(str(row.copy_changes)
      ? [
          "## Copy adjustments",
          "The client noted these things should be changed from the template's default copy or content:",
          "",
          str(row.copy_changes),
          "",
        ]
      : []),
    "## Brain dump, read this carefully",
    "The client's own words on what they want, anything specific, anything the form didn't cover:",
    "",
    str(row.brain_dump) || "(the client left this blank)",
    "",
    "## Build instructions",
    join([
      row.is_custom_build ? null : "- Read the template file first",
      "- Read .claude/skills/humanizer/SKILL.md and .claude/skills/impeccable/SKILL.md before writing any copy or UI decisions, and .claude/skills/local-service-design-system/SKILL.md for the visual system",
      "- Personalize every section, do not leave template placeholder content anywhere",
      "- All copy should be in the business's voice, not Vilas's voice, not generic",
      `- The contact form must POST to /api/notify-client with the client's email as the recipient (env var CLIENT_EMAIL set to ${str(row.business_email) || "the client's business email"})`,
      str(row.desired_domain)
        ? `- Deploy target: ${str(row.desired_domain)}. Assume this domain will be attached to the Vercel project after build`
        : null,
      "- Commit to main when done",
    ]),
    "",
    "Report back with: what you changed from the template, any decisions you made that the client didn't specify, anything you'd flag for me to review.",
  ]
    .filter((block) => block !== null && block !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
