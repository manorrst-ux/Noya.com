import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { youtubeAuthorizeUrl } from "@/lib/integrations/youtube";
import { getEnv } from "@/lib/env";

export async function GET() {
  const env = getEnv();
  if (!env.YOUTUBE_CLIENT_ID || !env.YOUTUBE_CLIENT_SECRET || !env.YOUTUBE_REDIRECT_URI) {
    return NextResponse.json({ error: "YouTube OAuth is not configured" }, { status: 503 });
  }
  const state = crypto.randomBytes(32).toString("hex");
  const response = NextResponse.redirect(youtubeAuthorizeUrl(state));
  response.cookies.set("noya_oauth_state", state, {
    httpOnly: true,
    secure: new URL(env.NEXT_PUBLIC_APP_URL).protocol === "https:",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
