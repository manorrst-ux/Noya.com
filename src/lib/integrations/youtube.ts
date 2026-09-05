import { env } from "@/lib/env";

export function youtubeConfigured() { return Boolean(env.YOUTUBE_CLIENT_ID && env.YOUTUBE_CLIENT_SECRET && env.YOUTUBE_REDIRECT_URI); }
export function youtubeAuthorizeUrl(state: string) {
  if (!youtubeConfigured()) throw new Error("YouTube OAuth is not configured");
  const params = new URLSearchParams({ client_id: env.YOUTUBE_CLIENT_ID!, redirect_uri: env.YOUTUBE_REDIRECT_URI!, response_type: "code", access_type: "offline", scope: "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly", state });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}
