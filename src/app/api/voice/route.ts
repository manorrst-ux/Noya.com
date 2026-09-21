import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";

export async function POST(request: Request) {
  const env = getEnv();
  if (!env.ELEVENLABS_API_KEY || !env.ELEVENLABS_VOICE_ID) return NextResponse.json({ error: "ElevenLabs is not configured" }, { status: 503 });
  const body = await request.json().catch(() => ({})) as { text?: string };
  if (!body.text?.trim()) return NextResponse.json({ error: "text is required" }, { status: 400 });
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(env.ELEVENLABS_VOICE_ID)}`, {
    method: "POST",
    headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text: body.text, model_id: "eleven_multilingual_v2", output_format: "mp3_44100_128" }),
    cache: "no-store",
  });
  if (!response.ok) return NextResponse.json({ error: "ElevenLabs request failed", details: await response.text() }, { status: 502 });
  return new NextResponse(await response.arrayBuffer(), { status: 200, headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
}
