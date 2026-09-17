#!/usr/bin/env node
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function screenshot(url, outputPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to capture a desktop-sized screenshot
  await page.setViewportSize({ width: 1280, height: 800 });

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: "load", timeout: 60000 });

  // Take the screenshot
  await page.screenshot({
    path: outputPath,
    fullPage: true,
  });

  await browser.close();
  console.log(`Screenshot saved to ${outputPath}`);
}

const url = process.argv[2] || "https://trfox.vercel.app";
const output = process.argv[3] || "trfox-screenshot.png";

screenshot(url, output).catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
