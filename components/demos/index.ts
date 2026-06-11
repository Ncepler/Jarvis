import type { ComponentType } from "react";
import { LawnCareDemo } from "./LawnCareDemo";

// slug → inline homepage component. An entry here renders the homepage
// PHYSICALLY inside the gallery (card thumbnail, backdrop, and the open
// panel) — no iframe. This is the preferred way to show our own builds:
// drop the homepage component in this folder, register it, add the
// matching project in lib/projects.ts.
export const demos: Record<string, ComponentType> = {
  "demo-lawncare": LawnCareDemo,
};
