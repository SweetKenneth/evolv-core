import { NextResponse } from "next/server";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google"; // Gemini
import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    const { prompt, model: requestedModel } = await req.json();

    const model = requestedModel || process.env.AI_MODEL || "groq/llama-3.1-70b";

    const isGoogle = model.startsWith("google/");
    const isOpenAI = model.startsWith("openai/");
    const isGroq =
      model.startsWith("groq/") || model === "moonshotai/kimi-k2-instruct-0905";

    // Placeholder for future LLMs
    const isCustom = model.startsWith("custom/");

    const modelProvider = isOpenAI
      ? openai
      : isGoogle
      ? google
      : isGroq
      ? groq
      : isCustom
      ? () => {
          throw new Error("Custom model not implemented yet");
        }
      : groq;

    let actualModel: string;
    if (isOpenAI) {
      actualModel = model.replace("openai/", "");
    } else if (isGoogle) {
      actualModel = model.replace("google/", "");
    } else if (isGroq) {
      actualModel = model.replace("groq/", "");
    } else if (isCustom) {
      actualModel = model.replace("custom/", "");
    } else {
      actualModel = model;
    }

    const response = await streamText({
      model: modelProvider(actualModel),
      prompt,
    });

    return new NextResponse(response.stream, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (err) {
    console.error("[generate-ai-code-stream] Error:", err);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate text stream" }),
      { status: 500 }
    );
  }
}
