import type { ResearchResult, ShortScript } from "./types";

export interface ScriptProvider { generate(prompt: string): Promise<ShortScript>; }

export async function createShortScript(topic: string, research: ResearchResult, provider?: ScriptProvider): Promise<ShortScript> {
  const prompt = `Create an original English YouTube Short about: ${topic}. Use only supported claims from the supplied research. Target 45-60 seconds, strong hook, concise narration, and a non-clickbait CTA. Research: ${JSON.stringify(research)}`;
  if (provider) return provider.generate(prompt);
  return { hook: `Here’s what you need to know about ${topic}.`, body: [research.summary || "Research is ready for production.", "We checked the available claims before drafting this Short."], cta: "Follow for the next story.", estimatedSeconds: 50 };
}
