# Borao development-preview deployment checklist

## Build preflight
- Node 22.x
- `npm install` succeeds and creates `package-lock.json`
- `npm run typecheck`
- `npm run build`
- `/api/health` returns `{ "ok": true }`

## Required environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Use the publishable key only. Never add a Supabase service-role key to the browser environment.

## First authenticated smoke test
1. Create a new account.
2. Confirm the email.
3. Finish onboarding.
4. Confirm Today shows a recommendation.
5. Start Lesson 001.
6. Leave after recognition, return, and confirm resume.
7. Complete the lesson.
8. Confirm `learner_evidence_events` contains append-only evidence.
9. Confirm `learner_concept_state` changed.
10. Confirm an unconsumed recommendation exists for the next best eligible content.

## Tamper-resistance checks
- Client cannot directly insert/update/delete `learner_evidence_events`.
- Client cannot directly mutate `learner_concept_state` or recommendations.
- Submitting a made-up assessment UUID fails.
- Submitting an assessment for a different content item fails.
- Non-published content cannot be assessed.
- Another learner's progress/evidence/profile rows are invisible.

## Before publishing Content Block 02
- Native-speaker language QA complete.
- Pedagogical QA complete.
- Camila/Nico speaker records approved/published.
- Assessment items moved from `qa` to `published`.
- Content item moved from `language_qa` to `published`.
- Recommendation selector tested with both lessons eligible.
