import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Force dynamic to keep streaming happy
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { prompt, model: requestedModel } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const model = requestedModel || process.env.AI_MODEL || "groq/llama-3.1-70b";

    const isGoogle = model.startsWith("google/");
    const isOpenAI = model.startsWith("openai/");
    const isGroq =
      model.startsWith("groq/") || model === "moonshotai/kimi-k2-instruct-0905";
    const isCustom = model.startsWith("custom/"); // placeholder for future LLMs

    const groq = createGroq({
      apiKey: process.env.AI_GATEWAY_API_KEY ?? process.env.GROQ_API_KEY,
      baseURL: process.env.AI_GATEWAY_API_KEY
        ? "https://ai-gateway.vercel.sh/v1"
        : undefined,
    });

    const openai = createOpenAI({
      apiKey: process.env.AI_GATEWAY_API_KEY ?? process.env.OPENAI_API_KEY,
      baseURL:
        process.env.AI_GATEWAY_API_KEY
          ? "https://ai-gateway.vercel.sh/v1"
          : process.env.OPENAI_BASE_URL,
    });

    const google = createGoogleGenerativeAI({
      apiKey: process.env.AI_GATEWAY_API_KEY ?? process.env.GEMINI_API_KEY,
      baseURL: process.env.AI_GATEWAY_API_KEY
        ? "https://ai-gateway.vercel.sh/v1"
        : undefined,
    });

    // pick provider
    const modelProvider = isOpenAI
      ? openai
      : isGoogle
      ? google
      : isGroq
      ? groq
      : isCustom
      ? () => {
          throw new Error("custom/* models not implemented yet");
        }
      : groq;

    // normalize model id per provider
    let actualModel: string;
    if (isOpenAI) actualModel = model.replace("openai/", "");
    else if (isGoogle) actualModel = model.replace("google/", "");
    else if (isGroq) actualModel = model.replace("groq/", "");
    else if (isCustom) actualModel = model.replace("custom/", "");
    else actualModel = model;

    const result = await streamText({
      model: modelProvider(actualModel),
      prompt,
      // keep it boring and predictable
      temperature: 0.2,
    });

    // This returns a proper NextResponse for your AI SDK version
    return result.toAIStreamResponse();
  } catch (err) {
    console.error("[generate-ai-code-stream] Error:", err);
    return new Response(JSON.stringify({ error: "Stream init failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

