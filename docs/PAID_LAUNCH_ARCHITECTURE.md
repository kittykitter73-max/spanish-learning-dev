# Paid Launch Architecture — v0.1

Borao should be built as a consumer subscription product, but payments should not own product logic.

## Identity
Supabase Auth owns identity. `auth.users.id` is the canonical learner ID.

## Learning ownership
- `concepts`: canonical curriculum targets.
- `content_items`: songs, spoken lessons, games, missions.
- `learner_evidence_events`: immutable historical evidence.
- `learner_concept_state`: derived/recomputable summary.
- `recommendations`: auditable derived decisions.
- favorites/playlists: preference and library state, not mastery.

## Billing ownership
A payment processor will own charge/payment/subscription transactions.
Borao owns only the minimum mirrored identifiers and entitlements needed to decide what the learner may access.

Never store card numbers or sensitive payment credentials in Borao.

## Environments
- Development: local + dedicated dev database/keys.
- Staging: hosted preview + isolated staging database/project or branch.
- Production: separate production project, production secrets, monitored deploys.

## Launch principle
Do not bolt payments onto a prototype and call it production. Paid launch is a promotion gate requiring auth, webhook reliability, entitlement correctness, policies, recovery, monitoring, content rights, and support.
