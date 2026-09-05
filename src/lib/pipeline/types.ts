export type ContentCategory = "world-news" | "viral" | "ai-tech" | "facts" | "mystery" | "history";
export type Source = { title: string; url: string; publisher: string; publishedAt?: string };
export type ResearchResult = { summary: string; sources: Source[]; claims: { claim: string; verdict: "supported" | "mixed" | "unverified"; evidence: string }[] };
export type ShortScript = { hook: string; body: string[]; cta: string; estimatedSeconds: number };
export type VideoJob = { scriptId: string; aspectRatio: "9:16"; durationSeconds: number; subtitleFormat: "srt"; voice?: string };
