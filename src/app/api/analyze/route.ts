import OpenAI from "openai";
import { NextResponse } from "next/server";
import { analyzeInput } from "@/lib/analyzer";

const prompt = (input: string) => `You are Web Doctor AI, a website analyzer for URLs and source code.
The user input may contain a website URL, HTML, CSS, JavaScript, React, PHP, or Python.
Analyze the input and return ONLY valid JSON with these keys:
- score: number between 0 and 100
- summary: one concise sentence
- recommendations: array of 3 short improvement suggestions
- breakdown: object with numeric values 0-100 for seo, speed, accessibility, security, quality
- issues: array of objects with title, severity (Low/Medium/High/Critical), detail, fix
Do not include any extra text before or after the JSON. Here is the input:
${input}`;

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = typeof body?.input === "string" ? body.input : "";

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      error: "Missing OPENAI_API_KEY. Set it in the environment and restart.",
      ...analyzeInput(input),
    }, { status: 200 });
  }

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are Web Doctor AI, a website analyzer that returns structured JSON reports." },
        { role: "user", content: prompt(input) },
      ],
      temperature: 0.2,
    });

    const rawText = response.choices?.[0]?.message?.content || "";
    let json = null;

    try {
      json = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/```json([\s\S]*?)```/i);
      const payload = match ? match[1] : rawText;
      json = JSON.parse(payload);
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("AI analyze error", error);
    return NextResponse.json({
      error: "OpenAI analysis failed, falling back to local analyzer.",
      ...analyzeInput(input),
    }, { status: 200 });
  }
}
