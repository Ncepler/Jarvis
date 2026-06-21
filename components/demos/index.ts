import type { ComponentType } from "react";
import { AutoBodyDemo } from "./AutoBodyDemo";
import { BakeryDemo } from "./BakeryDemo";
import { BarberDemo } from "./BarberDemo";
import { FloristDemo } from "./FloristDemo";
import { LandscapingDemo } from "./LandscapingDemo";
import { LawnCareDemo } from "./LawnCareDemo";
import { PowerWashDemo } from "./PowerWashDemo";
import { RenovationDemo } from "./RenovationDemo";

// slug → inline homepage component. An entry here renders the homepage
// PHYSICALLY inside the gallery (card thumbnail, backdrop, and the open
// panel) — no iframe. This is the preferred way to show our own builds:
// drop the homepage component in this folder, register it, add the
// matching project in lib/projects.ts.
export const demos: Record<string, ComponentType> = {
  "demo-renovation": RenovationDemo,
  "demo-landscaping": LandscapingDemo,
  "demo-powerwash": PowerWashDemo,
  "demo-florist": FloristDemo,
  "demo-lawncare": LawnCareDemo,
  "demo-bakery": BakeryDemo,
  "demo-barber": BarberDemo,
  "demo-autobody": AutoBodyDemo,
};
