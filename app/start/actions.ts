"use server";

import { loadTemplateContent } from "@/lib/templateContent";

// The customize page asks for this the moment a template is picked. Public and
// read-only: everything it returns is copy that's already on the demo pages.
export async function getTemplateContent(key: string) {
  return loadTemplateContent(key);
}
