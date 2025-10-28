if (typeof global.File === "undefined") {
  global.File = class {};
}

import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function POST(req) {
  const { url } = await req.json();
  if (!url) {
    return new Response(JSON.stringify({ error: "URL required" }), { status: 400 });
  }

  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const title = $("title").text() || "No title found";

  return new Response(JSON.stringify({ success: true, title }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
