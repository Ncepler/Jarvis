// Shared types + defaults for the /start intake form (components/intake/*).
// Kept in one file so the shape of a submission is defined exactly once —
// the form state, the localStorage draft, and the /api/intake payload all
// key off IntakeDraft.

export type PaletteChoice = "template" | "own" | "";
export type HasLogoChoice = "yes" | "no" | "";

export type DayHours = {
  day: string;
  closed: boolean;
  open: string;
  close: string;
};

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const defaultHours = (): DayHours[] =>
  DAYS.map((day) => ({
    day,
    closed: day === "Sunday",
    open: "09:00",
    close: "17:00",
  }));

// Text-only fields — the only ones written to localStorage. Files (logo,
// photos) can't survive JSON.stringify, so they live in separate component
// state and don't persist across a refresh (flagged for Noah in the build
// report).
export type IntakeDraft = {
  // page 1 — contact
  businessName: string;
  yourName: string;
  businessEmail: string;
  phone: string;
  address: string;

  // page 2 — brand
  paletteChoice: PaletteChoice;
  mainColor: string;
  accentColor: string;
  hasLogo: HasLogoChoice;

  // page 3 — content
  template: string;
  services: string;
  hours: DayHours[];
  instagram: string;
  facebook: string;
  googleBusiness: string;

  // page 4 — brain dump
  brainDump: string;
};

export const emptyDraft = (): IntakeDraft => ({
  businessName: "",
  yourName: "",
  businessEmail: "",
  phone: "",
  address: "",
  paletteChoice: "",
  mainColor: "#1a1612",
  accentColor: "#8a5a2b",
  hasLogo: "",
  template: "",
  services: "",
  hours: defaultHours(),
  instagram: "",
  facebook: "",
  googleBusiness: "",
  brainDump: "",
});

export const STORAGE_KEY = "vilas-intake-draft-v1";
export const TOTAL_STEPS = 4;

export const isValidEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());
export const HEX_RE = /^#(?:[0-9a-f]{3}){1,2}$/i;
export const isValidHex = (v: string) => HEX_RE.test(v.trim());

export function page1Valid(d: IntakeDraft) {
  return (
    d.businessName.trim() !== "" &&
    d.yourName.trim() !== "" &&
    isValidEmail(d.businessEmail) &&
    d.address.trim() !== ""
  );
}

export function page2Valid(d: IntakeDraft, hasLogoFile: boolean) {
  if (!d.paletteChoice) return false;
  if (d.paletteChoice === "own" && !(isValidHex(d.mainColor) && isValidHex(d.accentColor))) {
    return false;
  }
  if (!d.hasLogo) return false;
  if (d.hasLogo === "yes" && !hasLogoFile) return false;
  return true;
}

export function page3Valid(d: IntakeDraft) {
  return d.template.trim() !== "" && d.services.trim() !== "";
}
