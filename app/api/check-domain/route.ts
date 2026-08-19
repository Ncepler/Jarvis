import { NextResponse } from "next/server";
import { isValidDomain, scrubDomain } from "@/lib/intake";

export const runtime = "edge";

// Availability lookup for the /start form's domain field. Vercel's status
// endpoint is a free read: you only pay if you actually register. The token
// stays server-side.
export async function GET(req: Request) {
  const domain = scrubDomain(new URL(req.url).searchParams.get("domain") ?? "");
  if (!isValidDomain(domain)) {
    return NextResponse.json({ available: false, reason: "invalid" }, { status: 400 });
  }

  const token = process.env.VERCEL_API_TOKEN;
  if (!token) {
    return NextResponse.json({ available: false, reason: "unconfigured" }, { status: 503 });
  }

  const team = process.env.VERCEL_TEAM_ID;
  const url =
    `https://api.vercel.com/v4/domains/status?name=${encodeURIComponent(domain)}` +
    (team ? `&teamId=${encodeURIComponent(team)}` : "");

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ available: false, reason: "lookup-failed" }, { status: 502 });
    }
    const json = (await res.json()) as { available?: boolean };
    return NextResponse.json({ available: Boolean(json.available) });
  } catch {
    return NextResponse.json({ available: false, reason: "lookup-failed" }, { status: 502 });
  }
}
