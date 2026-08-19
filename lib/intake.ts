// Shared types + validation for the /start intake form (components/intake/*)
// and the /d48 dashboard. One file so the shape of a submission is defined
// exactly once: form state, the localStorage draft, the /api/intake payload,
// and the Supabase row all key off what's here.

import { questionsFor } from "./templates";

export type PaletteChoice = "template" | "own" | "";
export type HasLogoChoice = "yes" | "no" | "";
export type UsingTemplate = "yes" | "no" | "";

export type DayHours = { day: string; closed: boolean; open: string; close: string };

export const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;

export const defaultHours = (): DayHours[] =>
  DAYS.map((day) => ({ day, closed: day === "Sunday", open: "09:00", close: "17:00" }));

// Text-only fields, the only ones written to localStorage. Files can't
// survive JSON.stringify, so they live in separate component state and don't
// persist across a refresh.
export type IntakeDraft = {
  // page 1, contact + what they're building
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
  copyChanges: string;

  // page 5, brain dump
  brainDump: string;
};

export const emptyDraft = (): IntakeDraft => ({
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
  copyChanges: "",
  brainDump: "",
});

// Files live outside the draft (see above) but validation needs to know
// which ones are present.
export type IntakeFiles = {
  mainLogo: File | null;
  profileLogo: File | null;
  profileLogoOriginal: File | null;
  photos: File[];
  heroVideo: File | null;
};

export const emptyFiles = (): IntakeFiles => ({
  mainLogo: null,
  profileLogo: null,
  profileLogoOriginal: null,
  photos: [],
  heroVideo: null,
});

export const STORAGE_KEY = "vilas-intake-draft-v2";
export const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
export const VIDEO_TYPES = ".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm";

// Tighter than RFC-valid on purpose: g@g.g passes a loose check and is
// useless to us. Needs a dot after the @ and two real characters after it.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isValidEmail = (v: string) => EMAIL_RE.test(v.trim());

export const HEX_RE = /^#(?:[0-9a-f]{3}){1,2}$/i;
export const isValidHex = (v: string) => HEX_RE.test(v.trim());

// Phone: digits plus the punctuation people actually type. Applied on input
// so an invalid character never lands in state.
export const scrubPhone = (v: string) => v.replace(/[^0-9+()\-.\s]/g, "").slice(0, 30);
export const isValidPhone = (v: string) => v.replace(/\D/g, "").length >= 7;

// Domain: strip what people paste in front of it and any trailing path.
export const scrubDomain = (v: string) =>
  v.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
export const DOMAIN_RE = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;
export const isValidDomain = (v: string) => DOMAIN_RE.test(scrubDomain(v));

// ── Steps ────────────────────────────────────────────────────────────────
// Page 4 only exists when they picked a template, so the step list is built
// per draft rather than being a constant.
export type StepId = "contact" | "brand" | "content" | "customize" | "braindump";

export const stepsFor = (d: IntakeDraft): { id: StepId; label: string }[] =>
  [
    { id: "contact" as const, label: "Contact" },
    { id: "brand" as const, label: "Brand" },
    { id: "content" as const, label: "Content" },
    ...(d.usingTemplate === "yes"
      ? [{ id: "customize" as const, label: "Customize" }]
      : []),
    { id: "braindump" as const, label: "Last thing" },
  ];

// ── Validation ───────────────────────────────────────────────────────────
// One map of field key to the message shown under that field. Empty map
// means the step is clean. Keys match the `name` each field renders with, so
// the form can scroll to the first bad one.
export type Errors = Record<string, string>;

const REQUIRED = "This one's required.";

export function validateStep(
  id: StepId,
  d: IntakeDraft,
  files: IntakeFiles,
): Errors {
  const e: Errors = {};
  if (id === "contact") {
    if (!d.usingTemplate) e.usingTemplate = "Pick one so we know where to start.";
    if (d.usingTemplate === "yes" && !d.templateChoice) {
      e.templateChoice = "Pick the template you want to build on.";
    }
    if (!d.businessName.trim()) e.businessName = REQUIRED;
    if (!d.businessType.trim()) e.businessType = "Tell us what kind of business this is.";
    if (!d.yourName.trim()) e.yourName = REQUIRED;
    if (!d.businessEmail.trim()) e.businessEmail = REQUIRED;
    else if (!isValidEmail(d.businessEmail)) {
      e.businessEmail = "Please enter a valid email address.";
    }
    if (d.phone.trim() && !isValidPhone(d.phone)) {
      e.phone = "That's too short to be a phone number.";
    }
    if (!d.address.trim()) e.address = REQUIRED;
    if (!d.desiredDomain.trim()) e.desiredDomain = "We need a domain to aim at.";
    else if (!isValidDomain(d.desiredDomain)) {
      e.desiredDomain = "That doesn't look like a domain. Try something like yourshop.com.";
    }
  }
  if (id === "brand") {
    if (!d.paletteChoice) e.paletteChoice = "Pick one.";
    if (d.paletteChoice === "own") {
      if (!isValidHex(d.mainColor)) e.mainColor = "That isn't a hex code. They look like #8A5A2B.";
      if (!isValidHex(d.accentColor)) e.accentColor = "That isn't a hex code. They look like #8A5A2B.";
    }
    if (!d.hasLogo) e.hasLogo = "Pick one.";
    if (d.hasLogo === "yes" && !files.mainLogo) {
      e.mainLogo = "Upload your logo, or switch to text above.";
    }
  }
  if (id === "content") {
    if (!d.services.trim()) e.services = "We need at least a rough list.";
    if (files.heroVideo && files.heroVideo.size > MAX_VIDEO_BYTES) {
      e.heroVideo = "That's over 25MB. Trim it or export it smaller.";
    }
  }
  // "customize" and "braindump" are entirely optional by design.
  return e;
}

// ── The Supabase row ─────────────────────────────────────────────────────
// What /api/intake writes and what /d48 + lib/generatePrompt.ts read back.
export type SubmissionStatus = "new" | "in progress" | "done";
export const STATUSES: SubmissionStatus[] = ["new", "in progress", "done"];

export type PhotoRef = { name: string; url: string };

export type SubmissionRow = {
  id: string;
  created_at: string;
  status: string | null;
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
  template: string | null;
  services: string | null;
  hours: DayHours[] | null;
  instagram: string | null;
  facebook: string | null;
  google_business: string | null;
  photo_urls: PhotoRef[] | null;
  template_customizations: Record<string, string> | null;
  copy_changes: string | null;
  brain_dump: string | null;
};

// Re-exported so the form page and the dashboard don't both need to reach
// into lib/templates.ts for the same helper.
export { questionsFor };
