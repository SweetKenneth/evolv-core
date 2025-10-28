import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ success: false, error: "Missing URL" }, { status: 400 });
    }

    const response = await fetch(url);
    const html = await response.text();

    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Grab full page HTML
    const fullHTML = doc.documentElement.outerHTML;

    return NextResponse.json({ success: true, html: fullHTML });
  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json({ success: false, error: "Scrape failed" }, { status: 500 });
  }
}
