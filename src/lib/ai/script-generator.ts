import { z } from "zod";
import { estimatedVoiceSeconds, validateShortsScript, type ShortsScript } from "./shorts-script";
import type { ResearchResult } from "./research";

const aiResponseSchema = z.object({
  title: z.string(),
  hook: z.string(),
  narration: z.string(),
  visualPlan: z.array(z.string()),
});

export async function generateShortsScript(research: ResearchResult): Promise<ShortsScript> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const narration = `${research.summary} Here are the key facts. ${research.facts.join(" ")} Always check the original sources for important details.`;
    return validateShortsScript({
      title: research.topic,
      hook: `Here is what you need to know about ${research.topic}.`,
      narration,
      visualPlan: research.facts.slice(0, 6),
      estimatedSeconds: estimatedVoiceSeconds(narration),
    });
  }

  const prompt = `Write an original English YouTube Short based ONLY on this verified research. Topic: ${research.topic}. Summary: ${research.summary}. Facts: ${research.facts.join(" | ")}. Do not add unsupported claims. Create a compelling 0-2 second hook, concise narration for 35-65 seconds, and 4-8 visual shot descriptions. Return ONLY JSON with title, hook, narration, visualPlan.`;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-5-mini", input: prompt }),
  });
  if (!response.ok) throw new Error(`OpenAI script request failed: ${response.status}`);
  const data = (await response.json()) as { output_text?: string };
  const raw = data.output_text ?? "";
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("Script response was not valid JSON");
  const parsed = aiResponseSchema.parse(JSON.parse(raw.slice(start, end + 1)));
  return validateShortsScript({ ...parsed, estimatedSeconds: estimatedVoiceSeconds(parsed.narration) });
}
