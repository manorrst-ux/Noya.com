import { z } from "zod";

export const shortsScriptSchema = z.object({
  title: z.string().min(8).max(100),
  hook: z.string().min(10).max(180),
  narration: z.string().min(120).max(900),
  visualPlan: z.array(z.string().min(3)).min(3).max(12),
  estimatedSeconds: z.number().min(35).max(65),
});

export type ShortsScript = z.infer<typeof shortsScriptSchema>;

export function validateShortsScript(input: unknown): ShortsScript {
  return shortsScriptSchema.parse(input);
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimatedVoiceSeconds(text: string, wordsPerMinute = 155): number {
  return Math.round((wordCount(text) / wordsPerMinute) * 60);
}

export function isShortsLength(text: string): boolean {
  const seconds = estimatedVoiceSeconds(text);
  return seconds >= 35 && seconds <= 65;
}
