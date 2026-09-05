import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { youtubeAuthorizeUrl } from "@/lib/integrations/youtube";

export async function GET() {
  const state = crypto.randomBytes(24).toString("hex");
  const response = NextResponse.redirect(youtubeAuthorizeUrl(state));
  response.cookies.set("noya_oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 600, path: "/" });
  return response;
}
