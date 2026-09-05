import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1), NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"), CRON_SECRET: z.string().min(16),
  OPENAI_API_KEY: z.string().optional(), NEWS_API_KEY: z.string().optional(), ELEVENLABS_API_KEY: z.string().optional(), ELEVENLABS_VOICE_ID: z.string().optional(), VIDEO_PROVIDER_API_KEY: z.string().optional(),
  YOUTUBE_CLIENT_ID: z.string().optional(), YOUTUBE_CLIENT_SECRET: z.string().optional(), YOUTUBE_REDIRECT_URI: z.string().url().optional(),
  WORDPRESS_URL: z.string().url().optional(), WORDPRESS_CLIENT_ID: z.string().optional(), WORDPRESS_CLIENT_SECRET: z.string().optional(), S3_ENDPOINT: z.string().url().optional(), S3_ACCESS_KEY_ID: z.string().optional(), S3_SECRET_ACCESS_KEY: z.string().optional(), S3_BUCKET: z.string().optional()
});

export function getEnv() { return schema.parse(process.env); }
