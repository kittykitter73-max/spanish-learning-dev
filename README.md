# Borao (working name)

Entertainment-first Spanish learning app. **Borao is a replaceable working brand**; permanent architecture stays brand-neutral.

## Stage
Prototype v0.5. Customer journey, resumable lessons, secure scoring, 100-concept curriculum, and two content blocks now exist. Supabase development project: `spanish-learning-dev`.

## Stack
- Next.js App Router + TypeScript
- Supabase/Postgres + Auth + RLS
- Vercel (personal dev team only; never Marked Matter)
- provider-abstracted audio/AI later

## Run locally
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`
3. Fill the Supabase URL and publishable key
4. `npm run dev`

## Database
Migrations are in `supabase/migrations/` and are the schema source of truth.

## Learning truth
- exposure != mastery
- learner evidence events are append-only historical truth
- learner concept state is derived
- favorites/preferences do not increase mastery
- recommendations are deterministic and reason-codeable first


## Production scoring authority

The browser never declares an answer correct. Authenticated RPCs validate exposure/assessment submissions against published assessment definitions, then append evidence. Database triggers derive learner concept state and persist reason-coded recommendations.

## Prototype v0.5 product shell
- `/today` is now the signed-in home surface.
- It reads real learner evidence, derived concept state and reason-coded recommendations.
- `/learn` remains the first complete learning vertical slice.
- `/api/health` gives deployment monitoring a minimal health endpoint.
- Loading/error states exist for the lesson route.


## Current customer journey
`signup → confirm → onboarding → Today → recommendation/resume → lesson → scored evidence → concept state → recommendation closeout`

Content Block 01 is published. Content Block 02 is held in language QA until its release gate is satisfied.
