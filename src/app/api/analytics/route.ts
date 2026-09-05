import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, metrics: { views: 128000, likes: 6400, comments: 420, retention: 71.8 }, note: "Production implementation reads aggregated YouTube Analytics data from the database." });
}
