import { NextResponse } from "next/server";
import { logEvent, logError } from "@/lib/logger";

export async function POST(req: Request) {
  const { url } = await req.json();
  logEvent("Scrape initiated", { url });

  try {
    if (!url || !url.startsWith("http")) {
      logError("Invalid URL input", url);
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    logEvent("Sending to sandbox", { url });
    // this is where your E2B sandbox call will eventually go

    logEvent("Scrape completed successfully", { url });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    logError("Scrape failed", err);
    return NextResponse.json({ error: "Scrape failed", details: err.message }, { status: 500 });
  }
}
