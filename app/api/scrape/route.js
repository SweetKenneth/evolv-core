import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
      });
    }

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Grab title for a quick test
    const title = $("title").text() || "No title found";

    return new Response(JSON.stringify({ success: true, title }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to scrape" }), {
      status: 500,
    });
  }
}

