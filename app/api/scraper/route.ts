import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const response = await fetch(url);
    const html = await response.text();

    const dom = new JSDOM(html);
    const title = dom.window.document.querySelector("title")?.textContent || "No title found";

    return NextResponse.json({ success: true, title });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Scrape failed" }, { status: 500 });
  }
}
