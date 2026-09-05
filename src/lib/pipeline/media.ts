import type { ShortScript, VideoJob } from "./types";

export interface VoiceProvider { synthesize(text: string, voiceId: string): Promise<{ url: string }> }
export interface VideoProvider { render(job: VideoJob, audioUrl: string): Promise<{ url: string }> }
export interface SeoProvider { generate(script: ShortScript): Promise<{ title: string; description: string; tags: string[] }> }

export const defaultVideoJob = (scriptId: string, voice?: string): VideoJob => ({ scriptId, aspectRatio: "9:16", durationSeconds: 60, subtitleFormat: "srt", voice });
