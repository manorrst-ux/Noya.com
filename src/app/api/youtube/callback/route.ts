import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";

export async function GET(request: Request) {
  const env = getEnv(); const url = new URL(request.url); const code = url.searchParams.get("code"); const state = url.searchParams.get("state");
  const cookie = request.headers.get("cookie") ?? ""; const expected = cookie.match(/(?:^|; )noya_oauth_state=([^;]+)/)?.[1];
  if (!code || !state || !expected || state !== expected) return NextResponse.json({ error: "Invalid OAuth state" }, { status: 400 });
  if (!env.YOUTUBE_CLIENT_ID || !env.YOUTUBE_CLIENT_SECRET || !env.YOUTUBE_REDIRECT_URI) return NextResponse.json({ error: "YouTube OAuth is not configured" }, { status: 503 });
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: env.YOUTUBE_CLIENT_ID, client_secret: env.YOUTUBE_CLIENT_SECRET, redirect_uri: env.YOUTUBE_REDIRECT_URI, grant_type: "authorization_code" }) });
  if (!tokenResponse.ok) return NextResponse.json({ error: "OAuth token exchange failed" }, { status: 502 });
  // TODO: persist encrypted tokens through the database repository layer before enabling publishing.
  return NextResponse.redirect(new URL("/?youtube=connected", env.NEXT_PUBLIC_APP_URL));
}
