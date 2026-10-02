-- Auth trigger should only be invoked by the database trigger, never through the Data API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to postgres, service_role;

-- Cover foreign-key lookup paths identified by Supabase advisor.
create index if not exists concept_prerequisites_prereq_idx on public.concept_prerequisites(prerequisite_concept_id);
create index if not exists content_concepts_concept_idx on public.content_concepts(concept_id);
create index if not exists favorites_content_idx on public.favorites(content_item_id);
create index if not exists learner_state_concept_idx on public.learner_concept_state(concept_id);
create index if not exists evidence_concept_idx on public.learner_evidence_events(concept_id);
create index if not exists evidence_content_idx on public.learner_evidence_events(content_item_id);
create index if not exists evidence_segment_idx on public.learner_evidence_events(segment_id);
create index if not exists recommendations_content_idx on public.recommendations(content_item_id);
create index if not exists speakers_character_idx on public.speakers(character_id);
create index if not exists spoken_segments_speaker_idx on public.spoken_lesson_segments(speaker_id);
