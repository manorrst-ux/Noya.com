# Noya AI YouTube Automation

Production-oriented Next.js foundation for an automated YouTube Shorts studio.

## Included in the initial implementation
- Mobile-first automation dashboard
- Viral idea categories: world news, viral stories, AI/tech, facts, mystery and history
- Research/fact-checking, script, voice, video and SEO provider interfaces
- 60-second English Shorts script contract
- 9:16 video job contract with SRT subtitles
- YouTube OAuth initiation/callback and upload API boundaries
- Analytics API surface and Prisma data model
- WordPress sync API boundary
- Daily 8:00 PM Qatar scheduling via Vercel Cron (17:00 UTC)
- Environment-variable validation and `.env` protection
- CI for typecheck, tests, lint and production build

## Security
Never commit real credentials. Copy `.env.example` to `.env.local` and fill secrets locally or in the deployment platform's secret manager. OAuth tokens should be stored encrypted at rest in the database layer before production publishing is enabled.

## Local setup
1. `cp .env.example .env.local`
2. Set `DATABASE_URL` and `CRON_SECRET` plus the provider credentials you intend to enable.
3. `npm install`
4. `npx prisma generate`
5. `npm run dev`

## Architecture
`src/app` contains UI and API routes. `src/lib/pipeline` defines provider-agnostic automation contracts, while `src/lib/integrations` contains external integration boundaries. Provider credentials remain server-side and are read only from environment variables.

The next implementation phase should connect concrete AI research/LLM, ElevenLabs (or another TTS provider), a video renderer, encrypted OAuth token persistence, YouTube Analytics, and WordPress authentication/sync behind these interfaces.
