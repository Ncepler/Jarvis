export const SITE = {
  name: "STUDIO_NAME_TBD", // the FULL brand, e.g. "Word Studio" — swapped once, later
  founder: "FOUNDER_NAME_TBD", // Noah's display name on the business card
  domain: "DOMAIN_TBD", // may be a .studio or a compound .com — don't assume
  tagline: "TAGLINE_TBD",
  email: "CONTACT_EMAIL_TBD",
  instagram: "INSTAGRAM_URL_TBD",
  region: "Long Island, NY",
} as const;

// True while a SITE value is still a placeholder — components use this to
// avoid rendering broken links/strings before the brand exists.
export const isTBD = (value: string) => value.endsWith("_TBD");
