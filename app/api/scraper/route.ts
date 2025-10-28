import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ success: false, error: "URL required" }, { status: 400 });
    }

    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const title = $("title").text() || "No title found";

    return NextResponse.json({ success: true, title });
  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json({ success: false, error: "Scrape failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Scraper endpoint alive."
  });
}
