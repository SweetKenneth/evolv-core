import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ success: false, error: "Missing URL" }, { status: 400 });
    }

    // fetch the page
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch ${url}` },
        { status: 500 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // grab some sample data to verify scraper works
    const title = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content") || "";

    // return basic info
    return NextResponse.json({
      success: true,
      url,
      title,
      metaDescription,
    });
  } catch (err: any) {
    console.error("[Scraper Error]", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
