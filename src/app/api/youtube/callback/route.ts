import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { db } from "@/lib/db";
import { encryptSecret } from "@/lib/security/token-crypto";

export async function GET(request: Request) {
  const env = getEnv();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = request.headers.get("cookie") ?? "";
  const expected = cookie.match(/(?:^|; )noya_oauth_state=([^;]+)/)?.[1];

  if (!code || !state || !expected || state !== expected) {
    return NextResponse.json({ error: "Invalid OAuth state" }, { status: 400 });
  }
  if (!env.YOUTUBE_CLIENT_ID || !env.YOUTUBE_CLIENT_SECRET || !env.YOUTUBE_REDIRECT_URI || !env.YOUTUBE_TOKEN_ENCRYPTION_KEY) {
    return NextResponse.json({ error: "YouTube OAuth is not fully configured" }, { status: 503 });
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.YOUTUBE_CLIENT_ID,
      client_secret: env.YOUTUBE_CLIENT_SECRET,
      redirect_uri: env.YOUTUBE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });
  if (!tokenResponse.ok) return NextResponse.json({ error: "OAuth token exchange failed", details: await tokenResponse.text() }, { status: 502 });

  const token = await tokenResponse.json() as { access_token?: string; refresh_token?: string; expires_in?: number; scope?: string; token_type?: string };
  if (!token.access_token) return NextResponse.json({ error: "Google returned no access token" }, { status: 502 });

  await db.integration.upsert({
    where: { provider: "youtube" },
    create: {
      provider: "youtube",
      accessTokenEncrypted: encryptSecret(token.access_token),
      refreshTokenEncrypted: token.refresh_token ? encryptSecret(token.refresh_token) : null,
      expiresAt: new Date(Date.now() + (token.expires_in ?? 3600) * 1000),
      metadata: { scope: token.scope ?? "", tokenType: token.token_type ?? "Bearer" },
    },
    update: {
      accessTokenEncrypted: encryptSecret(token.access_token),
      ...(token.refresh_token ? { refreshTokenEncrypted: encryptSecret(token.refresh_token) } : {}),
      expiresAt: new Date(Date.now() + (token.expires_in ?? 3600) * 1000),
      metadata: { scope: token.scope ?? "", tokenType: token.token_type ?? "Bearer" },
    },
  });

  const response = NextResponse.redirect(new URL("/?youtube=connected", env.NEXT_PUBLIC_APP_URL));
  response.cookies.set("noya_oauth_state", "", { httpOnly: true, secure: new URL(env.NEXT_PUBLIC_APP_URL).protocol === "https:", sameSite: "lax", maxAge: 0, path: "/" });
  return response;
}
