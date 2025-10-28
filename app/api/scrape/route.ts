// Fix: prevent "File is not defined" on server
if (typeof (global as any).File === "undefined") {
  (global as any).File = class {};
}

import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $("title").text() || "No title found";

    return NextResponse.json({ success: true, title });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json({ error: "Failed to scrape" }, { status: 500 });
  }
}
