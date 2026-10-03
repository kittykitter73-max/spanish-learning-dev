# Staging Security Gate

## Decision context

Borao currently exposes three authenticated learning RPCs in the public schema:

- `record_content_exposure(uuid)`
- `save_content_progress(uuid, text, boolean)`
- `submit_assessment_response(uuid, uuid, text)`

Supabase's security advisor warns because these functions are `SECURITY DEFINER` and executable by authenticated users. This warning is valid and must be reviewed, but it does not by itself prove the functions are unsafe.

## Live audit findings — 2026-10-02

All three functions currently:

- are `SECURITY DEFINER`;
- set `search_path = ''`;
- deny `anon` execution;
- deny `PUBLIC` execution;
- allow `authenticated` execution intentionally;
- derive the learner identity from `auth.uid()` rather than accepting a learner ID from the client;
- require eligible published content before privileged writes.

Additional controls:

### record_content_exposure

- rejects unauthenticated calls;
- verifies the content item is published and rights-cleared;
- derives active target concepts from server-owned content metadata;
- writes only exposure evidence with fixed strength.

### save_content_progress

- rejects unauthenticated calls;
- restricts stage values to the known lesson state machine;
- verifies the content item is published and rights-cleared;
- writes progress only for `auth.uid()`;
- closes only recommendations belonging to `auth.uid()`.

### submit_assessment_response

- rejects unauthenticated calls;
- requires the assessment item to belong to the supplied content item;
- requires both assessment and content to be published;
- performs correctness scoring server-side from server-owned scoring rules;
- derives learner ID from `auth.uid()`;
- writes evidence for that authenticated learner only.

## Current architectural judgment

Do **not** rewrite these RPCs only to silence the advisor.

For the Prototype → Staging gate, the preferred approach is:

1. keep the current RPC boundary temporarily;
2. prove the boundary with authenticated tamper tests;
3. formally accept it for Staging if the tests pass;
4. reconsider moving privileged writes behind a private server-only service boundary before Production if the threat model or product scope increases.

This preserves a simple architecture while avoiding false confidence.

## Tests required before Staging

A real authenticated test learner is required. The development database currently has no auth users.

After the first preview signup:

1. Valid exposure call writes evidence only for the signed-in learner.
2. Valid progress save writes progress only for the signed-in learner.
3. A made-up assessment UUID is rejected.
4. A real assessment paired with the wrong content item is rejected.
5. A draft / language-QA assessment or content item is rejected.
6. The client cannot directly insert, update, or delete `learner_evidence_events`.
7. The client cannot directly mutate `learner_concept_state`.
8. The client cannot directly mutate `recommendations`.
9. A second learner cannot read or modify the first learner's profile, progress, evidence, mastery state, favorites, or recommendations.
10. Evidence submitted by learner A cannot be made to use learner B's ID because learner identity is derived from `auth.uid()`.

All test writes should either use disposable learner accounts or be transaction-wrapped / cleaned up after verification.

## Promotion rule

The SECURITY DEFINER advisor warning may be formally accepted for **Staging** only after the authenticated tamper suite passes.

Before **Production**, review whether the public authenticated RPC boundary is still the simplest safe design or whether privileged writes should move behind a private server-only API.

## Supabase advisor reference

Remediation guidance:
https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
