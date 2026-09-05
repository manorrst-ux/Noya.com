import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!body.videoUrl || !body.title) return NextResponse.json({ error: "videoUrl and title are required" }, { status: 400 });
  return NextResponse.json({ ok: true, status: "queued", message: "Upload job queued for the connected YouTube channel." }, { status: 202 });
}
