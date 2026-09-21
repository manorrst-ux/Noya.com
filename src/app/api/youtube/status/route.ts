import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const integration = await db.integration.findUnique({ where: { provider: "youtube" } });
  return NextResponse.json({
    provider: "youtube",
    connected: Boolean(integration?.refreshTokenEncrypted || integration?.accessTokenEncrypted),
    expiresAt: integration?.expiresAt ?? null,
  });
}
