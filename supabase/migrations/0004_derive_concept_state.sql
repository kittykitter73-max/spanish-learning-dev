create or replace function public.apply_evidence_to_concept_state()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_due timestamptz;
  success_delta numeric(5,4);
  fail_delta numeric(5,4);
begin
  success_delta := least(1.0, greatest(0.0, new.evidence_strength));
  fail_delta := greatest(0.05, new.evidence_strength * 0.25);

  next_due := case
    when new.success is false then now() + interval '4 hours'
    when new.evidence_type in ('independent_production','spontaneous_transfer') then now() + interval '4 days'
    when new.evidence_type in ('guided_production','manipulation') then now() + interval '3 days'
    when new.evidence_type in ('meaning_recall','listening_comprehension') then now() + interval '2 days'
    else now() + interval '1 day'
  end;

  insert into public.learner_concept_state (
    learner_id, concept_id,
    recognition_confidence, recall_confidence, listening_confidence,
    manipulation_confidence, production_confidence, transfer_confidence,
    last_evidence_at, last_success_at, last_failure_at, due_at,
    support_level, recent_error_class, updated_at
  ) values (
    new.learner_id, new.concept_id,
    case when new.evidence_type='recognition' and new.success then success_delta else 0 end,
    case when new.evidence_type='meaning_recall' and new.success then success_delta else 0 end,
    case when new.evidence_type='listening_comprehension' and new.success then success_delta else 0 end,
    case when new.evidence_type='manipulation' and new.success then success_delta else 0 end,
    case when new.evidence_type in ('guided_production','independent_production') and new.success then success_delta else 0 end,
    case when new.evidence_type='spontaneous_transfer' and new.success then success_delta else 0 end,
    new.occurred_at,
    case when new.success then new.occurred_at end,
    case when new.success is false then new.occurred_at end,
    next_due,
    case
      when new.success and new.evidence_type in ('independent_production','spontaneous_transfer') then 0
      when new.success then 1
      else 2
    end,
    new.error_class,
    now()
  )
  on conflict (learner_id, concept_id) do update set
    recognition_confidence = case when new.evidence_type='recognition' then
      case when new.success then greatest(public.learner_concept_state.recognition_confidence, success_delta)
           else greatest(0, public.learner_concept_state.recognition_confidence - fail_delta) end
      else public.learner_concept_state.recognition_confidence end,
    recall_confidence = case when new.evidence_type='meaning_recall' then
      case when new.success then greatest(public.learner_concept_state.recall_confidence, success_delta)
           else greatest(0, public.learner_concept_state.recall_confidence - fail_delta) end
      else public.learner_concept_state.recall_confidence end,
    listening_confidence = case when new.evidence_type='listening_comprehension' then
      case when new.success then greatest(public.learner_concept_state.listening_confidence, success_delta)
           else greatest(0, public.learner_concept_state.listening_confidence - fail_delta) end
      else public.learner_concept_state.listening_confidence end,
    manipulation_confidence = case when new.evidence_type='manipulation' then
      case when new.success then greatest(public.learner_concept_state.manipulation_confidence, success_delta)
           else greatest(0, public.learner_concept_state.manipulation_confidence - fail_delta) end
      else public.learner_concept_state.manipulation_confidence end,
    production_confidence = case when new.evidence_type in ('guided_production','independent_production') then
      case when new.success then greatest(public.learner_concept_state.production_confidence, success_delta)
           else greatest(0, public.learner_concept_state.production_confidence - fail_delta) end
      else public.learner_concept_state.production_confidence end,
    transfer_confidence = case when new.evidence_type='spontaneous_transfer' then
      case when new.success then greatest(public.learner_concept_state.transfer_confidence, success_delta)
           else greatest(0, public.learner_concept_state.transfer_confidence - fail_delta) end
      else public.learner_concept_state.transfer_confidence end,
    last_evidence_at = new.occurred_at,
    last_success_at = case when new.success then new.occurred_at else public.learner_concept_state.last_success_at end,
    last_failure_at = case when new.success is false then new.occurred_at else public.learner_concept_state.last_failure_at end,
    due_at = next_due,
    support_level = case
      when new.success and new.evidence_type in ('independent_production','spontaneous_transfer') then greatest(0, public.learner_concept_state.support_level - 1)
      when new.success is false then least(3, public.learner_concept_state.support_level + 1)
      else public.learner_concept_state.support_level
    end,
    recent_error_class = case when new.success is false then new.error_class else public.learner_concept_state.recent_error_class end,
    updated_at = now();

  return new;
end;
$$;

revoke execute on function public.apply_evidence_to_concept_state() from public, anon, authenticated;
grant execute on function public.apply_evidence_to_concept_state() to postgres, service_role;

create trigger learner_evidence_updates_concept_state
after insert on public.learner_evidence_events
for each row execute procedure public.apply_evidence_to_concept_state();
