import { NextResponse } from "next/server";
import type { ContentCategory } from "@/lib/pipeline/types";
import { getEnv } from "@/lib/env";

const categories: ContentCategory[] = [
  "world-news",
  "viral",
  "ai-tech",
  "facts",
  "mystery",
  "history",
];

type Idea = {
  category: ContentCategory;
  title: string;
  hook: string;
  score: number;
  reason: string;
};

const fallbackIdeas: Idea[] = [
  { category: "ai-tech", title: "The AI change you may notice sooner than expected", hook: "AI is changing one everyday task faster than most people realize.", score: 8.8, reason: "Strong curiosity and everyday relevance" },
  { category: "facts", title: "A true fact that sounds completely made up", hook: "This sounds fake, but scientists can actually explain it.", score: 8.6, reason: "High curiosity and easy 60-second storytelling" },
  { category: "history", title: "The forgotten event that changed a modern habit", hook: "One overlooked moment helped shape something we use today.", score: 8.4, reason: "History + unexpected modern connection" },
  { category: "mystery", title: "The strange discovery researchers still debate", hook: "There is a detail about this discovery that still raises questions.", score: 8.5, reason: "Mystery creates strong watch-through potential" },
  { category: "viral", title: "Why the internet suddenly started talking about this", hook: "A simple moment turned into a global conversation almost overnight.", score: 8.7, reason: "Trend format with strong shareability" },
  { category: "world-news", title: "The world story worth understanding in 60 seconds", hook: "Here is the important part of today's big story, without the noise.", score: 8.9, reason: "Timely topic with clear explanatory value" },
];

function cleanIdeas(value: unknown): Idea[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const x = item as Record<string, unknown>;
      const category = categories.includes(x.category as ContentCategory) ? (x.category as ContentCategory) : "viral";
      const score = Number(x.score);
      if (typeof x.title !== "string" || typeof x.hook !== "string") return null;
      return {
        category,
        title: x.title.slice(0, 140),
        hook: x.hook.slice(0, 220),
        score: Number.isFinite(score) ? Math.min(10, Math.max(0, score)) : 7,
        reason: typeof x.reason === "string" ? x.reason.slice(0, 180) : "Strong Shorts potential",
      } satisfies Idea;
    })
    .filter((x): x is Idea => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const category = categories.includes(body.category) ? body.category : "all";
  const env = getEnv();

  if (!env.OPENAI_API_KEY) {
    const ideas = category === "all" ? fallbackIdeas : fallbackIdeas.filter((x) => x.category === category);
    return NextResponse.json({
      ok: true,
      provider: "fallback",
      configured: false,
      ideas: ideas.length ? ideas : fallbackIdeas,
      message: "OPENAI_API_KEY is not configured. Showing safe demo candidates; add the key in your deployment environment for live research and generation.",
    });
  }

  const prompt = `Generate 8 original YouTube Shorts topic candidates for a channel covering world news, viral stories, AI/tech, facts, mystery and history. Category filter: ${category}. Score each from 0-10 using global interest, novelty, curiosity, visual potential, viral potential, relevance, safety and 60-second fit. Avoid fabricated facts, clickbait that promises something untrue, copyrighted/reused concepts, and unverifiable claims. Return ONLY valid JSON with an array named ideas. Each item must contain category, title, hook, score, reason.`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
        temperature: 0.8,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "AI provider request failed", ideas: fallbackIdeas }, { status: 502 });
    }

    const data = await response.json();
    const text = typeof data.output_text === "string" ? data.output_text : "";
    const parsed = JSON.parse(text.replace(/^```json\s*/i, "").replace(/\s*```$/i, ""));
    const ideas = cleanIdeas(parsed.ideas);

    return NextResponse.json({
      ok: true,
      provider: "openai",
      configured: true,
      ideas: ideas.length ? ideas : fallbackIdeas,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "AI response could not be parsed", ideas: fallbackIdeas }, { status: 502 });
  }
}
