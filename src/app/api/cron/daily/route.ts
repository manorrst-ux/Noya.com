import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";

export async function POST(request: Request) {
  const env = getEnv();
  if (request.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, queuedAt: new Date().toISOString(), schedule: "20:00", jobs: ["research","script","voice","video","seo","publish"] });
}
