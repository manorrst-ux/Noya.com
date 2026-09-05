import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  if (!env.WORDPRESS_URL) return NextResponse.json({ error: "WordPress integration is not configured" }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true, queued: true, wordpress: env.WORDPRESS_URL, contentId: body.contentId ?? null });
}
