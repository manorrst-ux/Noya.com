import { z } from "zod";

export const researchSourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  publisher: z.string().min(1),
  publishedAt: z.string().optional(),
  relevance: z.number().min(0).max(10),
});

export const researchResultSchema = z.object({
  topic: z.string().min(8),
  summary: z.string().min(20),
  facts: z.array(z.string().min(5)).min(1),
  sources: z.array(researchSourceSchema).min(1),
  confidence: z.number().min(0).max(1),
  needsManualReview: z.boolean(),
});

export type ResearchResult = z.infer<typeof researchResultSchema>;

export function validateResearch(input: unknown): ResearchResult {
  return researchResultSchema.parse(input);
}

export function buildResearchPrompt(topic: string): string {
  return `Research this topic for an original YouTube Short: ${topic}. Use authoritative, current sources where possible. Separate verified facts from uncertain claims. Never invent sources, dates, quotes, statistics, or events. Return structured JSON with topic, summary, facts, sources (title,url,publisher,publishedAt,relevance), confidence, and needsManualReview. A human review is required whenever facts are uncertain, controversial, rapidly changing, or poorly sourced.`;
}
