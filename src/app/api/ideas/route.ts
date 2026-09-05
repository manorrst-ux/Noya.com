import { NextResponse } from "next/server";
import type { ContentCategory } from "@/lib/pipeline/types";

const categories: ContentCategory[] = ["world-news","viral","ai-tech","facts","mystery","history"];
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const category = categories.includes(body.category) ? body.category : "viral";
  return NextResponse.json({ ok: true, category, queued: true, message: "Idea generation job queued. Connect an AI provider via environment variables to enable live generation." });
}
