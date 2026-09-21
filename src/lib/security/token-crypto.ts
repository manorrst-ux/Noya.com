import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { getEnv } from "@/lib/env";

function key() {
  const raw = Buffer.from(process.env.YOUTUBE_TOKEN_ENCRYPTION_KEY ?? "", "base64");
  if (raw.length !== 32) throw new Error("YOUTUBE_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key");
  return raw;
}

export function encryptSecret(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((x) => x.toString("base64url")).join(".");
}

export function decryptSecret(value: string) {
  const [ivB64, tagB64, dataB64] = value.split(".");
  if (!ivB64 || !tagB64 || !dataB64) throw new Error("Invalid encrypted secret");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB64, "base64url"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, "base64url")), decipher.final()]).toString("utf8");
}
