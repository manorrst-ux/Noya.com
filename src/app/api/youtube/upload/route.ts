import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { decryptSecret, encryptSecret } from "@/lib/security/token-crypto";
import { getEnv } from "@/lib/env";

async function getAccessToken() {
  const integration = await db.integration.findUnique({ where: { provider: "youtube" } });
  if (!integration) throw new Error("YouTube is not connected");
  if (integration.accessTokenEncrypted && integration.expiresAt && integration.expiresAt.getTime() > Date.now() + 60_000) {
    return decryptSecret(integration.accessTokenEncrypted);
  }
  if (!integration.refreshTokenEncrypted) throw new Error("YouTube refresh token is missing");
  const env = getEnv();
  const refreshed = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.YOUTUBE_CLIENT_ID!,
      client_secret: env.YOUTUBE_CLIENT_SECRET!,
      refresh_token: decryptSecret(integration.refreshTokenEncrypted),
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  if (!refreshed.ok) throw new Error("YouTube token refresh failed");
  const token = await refreshed.json() as { access_token?: string; expires_in?: number };
  if (!token.access_token) throw new Error("YouTube returned no refreshed access token");
  await db.integration.update({
    where: { provider: "youtube" },
    data: { accessTokenEncrypted: encryptSecret(token.access_token), expiresAt: new Date(Date.now() + (token.expires_in ?? 3600) * 1000) },
  });
  return token.access_token;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("video");
    if (!(file instanceof File)) return NextResponse.json({ error: "video file is required" }, { status: 400 });
    if (file.size > 256 * 1024 * 1024) return NextResponse.json({ error: "Video exceeds the 256 MB API limit for this endpoint" }, { status: 413 });

    const title = String(form.get("title") ?? "Noya AI Short").slice(0, 100);
    const description = String(form.get("description") ?? "").slice(0, 5000);
    const requestedPrivacy = String(form.get("privacyStatus") ?? "private");
    const privacyStatus = ["private", "public", "unlisted"].includes(requestedPrivacy) ? requestedPrivacy : "private";
    const publishAtRaw = String(form.get("publishAt") ?? "");
    const status: Record<string, string> = { privacyStatus };
    if (privacyStatus === "private" && publishAtRaw) status.publishAt = new Date(publishAtRaw).toISOString();

    const token = await getAccessToken();
    const init = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": file.type || "video/mp4",
        "X-Upload-Content-Length": String(file.size),
      },
      body: JSON.stringify({ snippet: { title, description, categoryId: "22" }, status }),
    });
    if (!init.ok) return NextResponse.json({ error: "YouTube upload session failed", details: await init.text() }, { status: 502 });
    const uploadUrl = init.headers.get("location");
    if (!uploadUrl) return NextResponse.json({ error: "YouTube did not return an upload URL" }, { status: 502 });

    const uploaded = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "video/mp4", "Content-Length": String(file.size) },
      body: await file.arrayBuffer(),
    });
    if (!uploaded.ok) return NextResponse.json({ error: "YouTube video upload failed", details: await uploaded.text() }, { status: 502 });

    const result = await uploaded.json() as { id?: string };
    return NextResponse.json({ ok: true, videoId: result.id ?? null, scheduled: Boolean(status.publishAt) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}
