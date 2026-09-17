#!/usr/bin/env node
import fs from "fs";
import path from "path";

const projectRef = "epynfvskwaxejdibvgbr";
const bucket = "client-site-captures";
const fileToUpload = process.argv[2] || "/tmp/trfox-screenshot.png";
const siteId = process.argv[3] || "58fc840a-2f91-4586-9473-d494ecd77cee"; // TRFox id from DB
const date = new Date().toISOString().split("T")[0];
const storagePath = `${siteId}/${date}.png`;

const SUPABASE_URL = "https://" + projectRef + ".supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error("Error: SUPABASE_ANON_KEY environment variable not set");
  console.error("Alternatively, use the manual capture API or set screenshot_url manually");
  process.exit(1);
}

async function upload() {
  const fileBuffer = fs.readFileSync(fileToUpload);

  const url = `${SUPABASE_URL}/storage/v1/object/${bucket}/${storagePath}`;

  console.log(`Uploading ${path.basename(fileToUpload)} to ${url}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "image/png",
      "x-upsert": "true",
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upload failed (${response.status}): ${text}`);
  }

  console.log("✓ Upload successful");
  console.log(`Path: ${storagePath}`);
  console.log(`URL: ${SUPABASE_URL}/storage/v1/object/public/${bucket}/${storagePath}`);
}

upload().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
