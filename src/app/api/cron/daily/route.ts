import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { generateTopicCandidates } from "@/lib/ai/content-engine";

export async function GET(request: Request) {
  const env = getEnv();
  if (request.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ideas = await generateTopicCandidates();
  const selected = [...ideas].sort((a, b) => b.score - a.score)[0] ?? null;
  return NextResponse.json({
    ok: true,
    queuedAt: new Date().toISOString(),
    timezone: "Asia/Qatar",
    target: "20:00",
    selectedTopic: selected,
    next: ["research", "fact-check", "script", "voice", "video", "captions", "seo", "review", "publish"],
  });
}
export async function POST(request: Request) { return GET(request); }
