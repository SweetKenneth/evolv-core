import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json(
        { success: false, error: "No URL provided" },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $("title").first().text().trim() || "No title found";
    const meta =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "No description found";
    const preview = $("body").text().replace(/\s+/g, " ").trim().slice(0, 500);

    console.log(`[SCRAPER] URL: ${url} | TITLE: ${title}`);

    return NextResponse.json({
      success: true,
      url,
      title,
      meta,
      preview,
    });
  } catch (err: any) {
    console.error("[SCRAPER ERROR]", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
