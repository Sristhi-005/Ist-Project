import OpenAI from "openai";
import { NextResponse } from "next/server";
import { analyzeInput, type AnalysisReport } from "@/lib/analyzer";

export const dynamic = "force-static";
export const revalidate = false;

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

function normalizeReport(payload: unknown, fallback: AnalysisReport): AnalysisReport {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const candidate = payload as Partial<AnalysisReport> & {
    breakdown?: Partial<AnalysisReport["breakdown"]>;
    recommendations?: unknown;
    issues?: unknown;
  };

  const breakdown = candidate.breakdown;
  const issues = Array.isArray(candidate.issues) ? candidate.issues : [];
  const recommendations = Array.isArray(candidate.recommendations) ? candidate.recommendations : [];

  const report: AnalysisReport = {
    score: typeof candidate.score === "number" ? candidate.score : fallback.score,
    summary: typeof candidate.summary === "string" ? candidate.summary : fallback.summary,
    issues: issues.filter((item): item is NonNullable<AnalysisReport["issues"][number]> => {
      if (!item || typeof item !== "object") return false;
      const issue = item as Record<string, unknown>;
      return typeof issue.title === "string" && typeof issue.detail === "string" && typeof issue.fix === "string";
    }).map((item) => ({
      title: (item as Record<string, unknown>).title as string,
      severity: ((item as Record<string, unknown>).severity as AnalysisReport["issues"][number]["severity"]) || "Medium",
      detail: (item as Record<string, unknown>).detail as string,
      fix: (item as Record<string, unknown>).fix as string,
    })),
    recommendations: recommendations.filter((item): item is string => typeof item === "string"),
    breakdown: {
      seo: typeof breakdown?.seo === "number" ? breakdown.seo : fallback.breakdown.seo,
      speed: typeof breakdown?.speed === "number" ? breakdown.speed : fallback.breakdown.speed,
      accessibility: typeof breakdown?.accessibility === "number" ? breakdown.accessibility : fallback.breakdown.accessibility,
      security: typeof breakdown?.security === "number" ? breakdown.security : fallback.breakdown.security,
      quality: typeof breakdown?.quality === "number" ? breakdown.quality : fallback.breakdown.quality,
    },
  };

  return report;
}

async function prepareAnalysisInput(rawInput: string): Promise<string> {
  const input = rawInput.trim();
  if (!input) return "";

  const isUrl = /https?:\/\//i.test(input);
  if (!isUrl) return input;

  try {
    const response = await fetch(input, {
      headers: { "User-Agent": "Mozilla/5.0" },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    return `${input}\n\n${text.slice(0, 12000)}`;
  } catch {
    return input;
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Web Doctor AI backend is running." });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = typeof body?.input === "string" ? body.input : "";
  const analysisInput = await prepareAnalysisInput(input);
  const fallback = analyzeInput(analysisInput);

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || !analysisInput) {
    return NextResponse.json({
      error: "Using local analyzer fallback.",
      ...fallback,
    }, { status: 200 });
  }

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are Web Doctor AI, a website analyzer that returns structured JSON reports." },
        { role: "user", content: prompt(analysisInput) },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const rawText = response.choices?.[0]?.message?.content || "";
    let parsed: unknown = null;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/```json([\s\S]*?)```/i);
      const payload = match ? match[1] : rawText;
      parsed = JSON.parse(payload);
    }

    return NextResponse.json(normalizeReport(parsed, fallback));
  } catch (error) {
    console.error("AI analyze error", error);
    return NextResponse.json({
      error: "OpenAI analysis failed, falling back to local analyzer.",
      ...fallback,
    }, { status: 200 });
  }
}
