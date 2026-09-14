import { z } from "zod";

export const topicCandidateSchema = z.object({
  category: z.string(),
  title: z.string().min(8),
  hook: z.string().min(8),
  score: z.number().min(0).max(10),
  rationale: z.string().min(1),
});

export type TopicCandidate = z.infer<typeof topicCandidateSchema>;

const fallback: TopicCandidate[] = [
  { category: "ai-tech", title: "The AI feature quietly changing how people work", hook: "This AI change is happening faster than most people realize.", score: 8.2, rationale: "Strong curiosity, broad relevance and good visual potential." },
  { category: "facts", title: "A true fact that sounds completely impossible", hook: "This sounds fake, but science says it is real.", score: 8.0, rationale: "High curiosity and strong short-form storytelling fit." },
  { category: "history", title: "The forgotten decision that changed modern life", hook: "One decision changed millions of lives—and few remember it.", score: 7.8, rationale: "Clear narrative arc with historical curiosity." },
];

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const raw = fenced ?? text;
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start < 0 || end < start) throw new Error("AI response did not contain a JSON array");
  return JSON.parse(raw.slice(start, end + 1));
}

export async function generateTopicCandidates(category?: string): Promise<TopicCandidate[]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return fallback.filter((x) => !category || x.category === category);

  const prompt = `Generate 8 original YouTube Shorts topic candidates. Category: ${category ?? "any of ai-tech, world-news, viral, facts, mystery, history"}. Score each 0-10 for global interest, novelty, curiosity, visual potential, viral potential, relevance, safety, and 60-second fit. Return ONLY JSON array with category,title,hook,score,rationale. Do not invent current facts or sources.`;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-5-mini", input: prompt }),
  });
  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
  const data = (await response.json()) as { output_text?: string };
  const parsed = z.array(topicCandidateSchema).safeParse(extractJson(data.output_text ?? ""));
  if (!parsed.success) throw new Error("AI topic response failed validation");
  return parsed.data.sort((a, b) => b.score - a.score);
}
