import { z } from "zod";

export const shortScriptSchema = z.object({
  title: z.string().min(8),
  hook: z.string().min(8),
  narration: z.string().min(120).max(900),
  visualPlan: z.array(z.string()).min(3).max(10),
  disclaimer: z.string().optional(),
});

export type ShortScript = z.infer<typeof shortScriptSchema>;

export function validateShortScript(input: unknown): ShortScript {
  return shortScriptSchema.parse(input);
}

export function estimateSeconds(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.round((words / 150) * 60);
}
