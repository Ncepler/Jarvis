// Shared types + validation for the /start intake form (components/intake/*)
// and the /d48 dashboard. One file so the shape of a submission is defined
// exactly once: form state, the localStorage draft, the /api/intake payload,
// and the Supabase row all key off what's here.

import { questionsFor, type ListField, type ListSpec } from "./templates";

export type PaletteChoice = "template" | "own" | "";
export type HasLogoChoice = "yes" | "no" | "";
export type UsingTemplate = "yes" | "no" | "";

export type DayHours = { day: string; closed: boolean; open: string; close: string };

export const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;

// No pre-filled times and no assumed day off — every business's hours are
// different, and a default that nobody has to touch is a default that ships.
// Each day starts blank; the client has to either set a time or tick closed.
export const defaultHours = (): DayHours[] =>
  DAYS.map((day) => ({ day, closed: false, open: "", close: "" }));

// A file that's already in Supabase Storage. Uploads happen the moment
// someone picks a file, not at submit, so what the draft carries is a URL
// rather than a File — which also means uploads survive a refresh.
export type Upload = { name: string; url: string };

// One item of a `list` question: field key → what the client typed.
export type Row = Record<string, string>;

export type IntakeUploads = {
  prefix: string; // storage folder, fixed on the first upload
  mainLogo: Upload | null;
  profileLogo: Upload | null;
  profileLogoOriginal: Upload | null;
  heroVideo: Upload | null;
  photos: Upload[];
};

export type IntakeDraft = {
  // page 1, contact + what they're building
  personalEmail: string;
  usingTemplate: UsingTemplate;
  templateChoice: string;
  desiredDomain: string;
  businessName: string;
  businessType: string;
  yourName: string;
  businessEmail: string;
  phone: string;
  address: string;

  // page 2, brand
  paletteChoice: PaletteChoice;
  mainColor: string;
  accentColor: string;
  hasLogo: HasLogoChoice;

  // page 3, content
  services: string;
  hours: DayHours[];
  instagram: string;
  facebook: string;
  googleBusiness: string;

  // page 4, per-template answers (keys come from lib/templates.ts)
  templateCustomizations: Record<string, string>;
  // The `list` questions, held as rows while they're being edited. Flattened
  // into templateCustomizations at submit, so the column, the dashboard, and
  // the build prompt never learn about rows. Kept apart from the flat answers
  // because a row someone added but hasn't typed in yet has to survive a
  // render — and an all-blank row has nothing to serialize.
  templateLists: Record<string, Row[]>;
  templateListsFor: string; // the template templateLists was seeded from
  // Question keys the client asked us to leave off the site entirely. Nothing
  // on a template is compulsory — a business with no reason for a scrolling
  // word strip shouldn't have to fill one in to get past this page.
  droppedSections: string[];
  copyChanges: string;

  // page 5, brain dump
  brainDump: string;

  uploads: IntakeUploads;
};

export const emptyUploads = (): IntakeUploads => ({
  prefix: "",
  mainLogo: null,
  profileLogo: null,
  profileLogoOriginal: null,
  heroVideo: null,
  photos: [],
});

export const emptyDraft = (): IntakeDraft => ({
  personalEmail: "",
  usingTemplate: "",
  templateChoice: "",
  desiredDomain: "",
  businessName: "",
  businessType: "",
  yourName: "",
  businessEmail: "",
  phone: "",
  address: "",
  paletteChoice: "",
  mainColor: "#1a1612",
  accentColor: "#8a5a2b",
  hasLogo: "",
  services: "",
  hours: defaultHours(),
  instagram: "",
  facebook: "",
  googleBusiness: "",
  templateCustomizations: {},
  templateLists: {},
  templateListsFor: "",
  droppedSections: [],
  copyChanges: "",
  brainDump: "",
  uploads: emptyUploads(),
});

export const STORAGE_KEY = "vilas-intake-draft-v3";
export const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const VIDEO_TYPES = ".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm";

export const slugify = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

// Tighter than RFC-valid on purpose: g@g.g passes a loose check and is
// useless to us. Needs a dot after the @ and two real characters after it.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isValidEmail = (v: string) => EMAIL_RE.test(v.trim());

export const HEX_RE = /^#(?:[0-9a-f]{3}){1,2}$/i;
export const isValidHex = (v: string) => HEX_RE.test(v.trim());

// Phone: digits plus the punctuation people actually type. `scrubPhone` runs
// on paste; PHONE_KEY_RE rejects the keystroke before it ever reaches state.
export const PHONE_KEY_RE = /^[0-9+()\-.\s]$/;
export const scrubPhone = (v: string) => v.replace(/[^0-9+()\-.\s]/g, "").slice(0, 30);
export const isValidPhone = (v: string) => v.replace(/\D/g, "").length >= 7;

// Domain: strip what people paste in front of it and any trailing path.
export const scrubDomain = (v: string) =>
  v.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
export const DOMAIN_RE = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;
export const isValidDomain = (v: string) => DOMAIN_RE.test(scrubDomain(v));

// Social fields take either a full web address or an @handle. The only thing
// that's definitely wrong is a sentence.
export const isValidHandle = (v: string) => !/\s/.test(v.trim()) && v.trim().length > 1;

// ── List answers ─────────────────────────────────────────────────────────
// A `list` question (lib/templates.ts) is edited as rows but stored as one
// string, so template_customizations stays a flat map and both the dashboard
// and the build prompt can print it without knowing about rows. One row per
// line, fields separated by a pipe — the format the older hints already
// taught. A pipe typed inside an answer becomes a slash so a row can't split
// itself in two.
export const rowsToText = (rows: Row[], fields: ListField[]) =>
  rows
    .map((r) =>
      fields
        .map((f) => (r[f.key] ?? "").replace(/\s*[\r\n]+\s*/g, " ").replace(/\|/g, "/").trim())
        .join(" | ")
        .replace(/(\s*\|\s*)+$/, ""),
    )
    .join("\n");

export const blankRow = (fields: ListField[]): Row =>
  Object.fromEntries(fields.map((f) => [f.key, ""]));

// The UI never lets someone drop below `min`; this keeps a short list legal
// anyway, since rows can arrive from an older stored draft.
export const padRows = (rows: Row[], list: ListSpec): Row[] => {
  const out = [...rows];
  while (out.length < (list.min ?? 0)) out.push(blankRow(list.fields));
  return out;
};

// ── Steps ────────────────────────────────────────────────────────────────
// Page 4 only exists when they picked a template, so the step list is built
// per draft rather than being a constant.
export type StepId = "contact" | "brand" | "content" | "customize" | "braindump";

export const stepsFor = (d: IntakeDraft): { id: StepId; label: string }[] => [
  { id: "contact", label: "Contact" },
  { id: "brand", label: "Brand" },
  { id: "content", label: "Content" },
  ...(d.usingTemplate === "yes" ? [{ id: "customize" as const, label: "Customize" }] : []),
  { id: "braindump", label: "Last thing" },
];

// ── Validation ───────────────────────────────────────────────────────────
// One map of field key to the message shown under that field. Empty map
// means the step is clean. Keys match the `data-field` each field renders
// with, so the form can scroll to the first bad one. A list question's rows
// key off `question.rowIndex`.
export type Errors = Record<string, string>;

const REQUIRED = "This field is required.";
const BAD_EMAIL = "That doesn't look like an email address. Check for the @ and a domain after it.";
const BAD_PHONE = "That doesn't look like a phone number. Ten digits is what we're after.";
const BAD_HEX = "That isn't a hex code. They look like #8A5A2B.";
const BAD_DOMAIN = "That doesn't look like a domain. Something like yourshop.com.";
const BAD_LINK = "That doesn't look like a link or a handle. Paste the web address, or your @name.";

export function validateStep(id: StepId, d: IntakeDraft): Errors {
  const e: Errors = {};
  const usingTemplate = d.usingTemplate === "yes";

  if (id === "contact") {
    if (!d.personalEmail.trim()) e.personalEmail = REQUIRED;
    else if (!isValidEmail(d.personalEmail)) e.personalEmail = BAD_EMAIL;
    if (!d.usingTemplate) e.usingTemplate = "Pick one so we know where to start.";
    if (usingTemplate && !d.templateChoice) e.templateChoice = "Pick the template you want to build on.";
    if (!d.businessName.trim()) e.businessName = REQUIRED;
    if (!d.yourName.trim()) e.yourName = REQUIRED;
    // Optional on a template build: the template already says what kind of
    // business this is. Required on a custom one, where nothing else does.
    if (!usingTemplate && !d.businessType.trim()) e.businessType = REQUIRED;
    if (!d.businessEmail.trim()) e.businessEmail = REQUIRED;
    else if (!isValidEmail(d.businessEmail)) e.businessEmail = BAD_EMAIL;
    if (d.phone.trim() && !isValidPhone(d.phone)) e.phone = BAD_PHONE;
    if (!d.address.trim()) e.address = REQUIRED;
    if (!d.desiredDomain.trim()) e.desiredDomain = REQUIRED;
    else if (!isValidDomain(d.desiredDomain)) e.desiredDomain = BAD_DOMAIN;
  }

  if (id === "brand") {
    if (!d.paletteChoice) e.paletteChoice = "Pick one.";
    if (d.paletteChoice === "own") {
      if (!isValidHex(d.mainColor)) e.mainColor = BAD_HEX;
      if (!isValidHex(d.accentColor)) e.accentColor = BAD_HEX;
    }
    if (!d.hasLogo) e.hasLogo = "Pick one.";
    if (d.hasLogo === "yes" && !d.uploads.mainLogo) {
      e.mainLogo = "Upload your logo, or switch to text above.";
    }
  }

  if (id === "content") {
    if (!d.services.trim()) e.services = REQUIRED;
    // Every day has to be an explicit choice — either a real open/close time
    // or "closed" ticked. Nothing pre-fills, so nothing ships unedited.
    d.hours.forEach((h, i) => {
      if (!h.closed && (!h.open.trim() || !h.close.trim())) {
        e[`hours.${i}`] = "Set this day's hours, or mark it closed.";
      }
    });
    for (const key of ["instagram", "facebook", "googleBusiness"] as const) {
      if (d[key].trim() && !isValidHandle(d[key])) e[key] = BAD_LINK;
    }
  }

  if (id === "customize" && usingTemplate) {
    for (const q of questionsFor(d.templateChoice)) {
      // A section that's being removed doesn't have to be filled in first.
      if (!q.list || d.droppedSections.includes(q.key)) continue;
      const rows = padRows(d.templateLists[q.key] ?? [], q.list);
      // The first field is the row's identity — the word, the question, the
      // name of the service. A row without one is an empty box.
      const first = q.list.fields[0].key;
      rows.forEach((r, i) => {
        if (!r[first]?.trim()) e[`${q.key}.${i}`] = "Fill this in or remove it.";
      });
    }
  }

  return e;
}

// Every list flattened onto the flat answers, which is what gets submitted.
export const mergedCustomizations = (d: IntakeDraft) => {
  const out = { ...d.templateCustomizations };
  for (const q of questionsFor(d.templateChoice)) {
    if (!q.list) continue;
    const rows = (d.templateLists[q.key] ?? []).filter((r) =>
      Object.values(r).some((v) => v.trim()),
    );
    if (rows.length) out[q.key] = rowsToText(rows, q.list.fields);
  }
  // A dropped section's answers are noise — what matters is that it goes.
  for (const key of d.droppedSections) delete out[key];
  return out;
};

// What a dropped question is called, for the dashboard and the build prompt.
export const droppedLabels = (templateKey: string, dropped: string[]) =>
  questionsFor(templateKey)
    .filter((q) => dropped.includes(q.key))
    .map((q) => q.label);

// ── The Supabase row ─────────────────────────────────────────────────────
// What /api/intake writes and what /d48 + lib/generatePrompt.ts read back.
export type SubmissionStatus = "new" | "in progress" | "done" | "archived";
// Order matters: it's the order of the dashboard's filter tabs.
export const STATUSES: SubmissionStatus[] = ["new", "in progress", "done", "archived"];
// What the per-row status dropdown offers. Archiving is its own action.
export const LIVE_STATUSES = STATUSES.filter((s) => s !== "archived");

export type PhotoRef = { name: string; url: string };

export type SubmissionRow = {
  id: string;
  created_at: string;
  status: string | null;
  ref_code: string | null;
  personal_email: string | null;
  business_name: string | null;
  business_type: string | null;
  your_name: string | null;
  business_email: string | null;
  phone: string | null;
  address: string | null;
  desired_domain: string | null;
  template_choice: string | null;
  is_custom_build: boolean | null;
  palette_choice: string | null;
  main_color: string | null;
  accent_color: string | null;
  has_logo: string | null;
  logo_url: string | null;
  main_logo_url: string | null;
  profile_logo_url: string | null;
  profile_logo_original_url: string | null;
  hero_video_url: string | null;
  services: string | null;
  hours: DayHours[] | null;
  instagram: string | null;
  facebook: string | null;
  google_business: string | null;
  photo_urls: PhotoRef[] | null;
  template_customizations: Record<string, string> | null;
  copy_changes: string | null;
  dropped_sections: string[] | null;
  brain_dump: string | null;
};

// Re-exported so the form page and the dashboard don't both need to reach
// into lib/templates.ts for the same helper.
export { questionsFor };
