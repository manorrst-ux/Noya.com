import type { ContentCategory, ResearchResult } from "./types";

export interface ResearchProvider { search(query: string): Promise<ResearchResult>; }

export class ResearchEngine {
  constructor(private readonly provider?: ResearchProvider) {}
  async research(topic: string, category: ContentCategory): Promise<ResearchResult> {
    if (!this.provider) return { summary: `Research queue created for ${category}: ${topic}`, sources: [], claims: [] };
    return this.provider.search(topic);
  }
}

export function validateResearch(result: ResearchResult): ResearchResult {
  return { ...result, claims: result.claims.filter(c => c.verdict !== "unverified") };
}
