revoke all on public.learner_profiles from anon, authenticated;
revoke all on public.concepts from anon, authenticated;
revoke all on public.concept_prerequisites from anon, authenticated;
revoke all on public.characters from anon, authenticated;
revoke all on public.speakers from anon, authenticated;
revoke all on public.content_items from anon, authenticated;
revoke all on public.content_concepts from anon, authenticated;
revoke all on public.spoken_lessons from anon, authenticated;
revoke all on public.spoken_lesson_segments from anon, authenticated;
revoke all on public.assessment_items from anon, authenticated;
revoke all on public.learner_evidence_events from anon, authenticated;
revoke all on public.learner_concept_state from anon, authenticated;
revoke all on public.favorites from anon, authenticated;
revoke all on public.recommendations from anon, authenticated;
revoke all on public.billing_customers from anon, authenticated;
revoke all on public.subscription_entitlements from anon, authenticated;

grant select on public.concepts, public.concept_prerequisites, public.characters, public.speakers,
  public.content_items, public.content_concepts, public.spoken_lessons, public.spoken_lesson_segments
  to anon, authenticated;

grant select on public.assessment_items to authenticated;
grant select, update on public.learner_profiles to authenticated;
grant select on public.learner_evidence_events to authenticated;
grant select on public.learner_concept_state to authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant select on public.recommendations to authenticated;
grant select on public.billing_customers to authenticated;
grant select on public.subscription_entitlements to authenticated;
