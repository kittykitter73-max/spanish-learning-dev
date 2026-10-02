create or replace function public.submit_assessment_response(
  p_assessment_item_id uuid,
  p_content_item_id uuid,
  p_response text
)
returns table(success boolean, evidence_type text, concept_id text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_item public.assessment_items%rowtype;
  v_response text;
  v_success boolean := false;
  v_base numeric(5,4);
  v_strength numeric(5,4);
  v_self_generated boolean;
  v_prefix text;
  v_first_word text;
  v_error_class text;
begin
  if v_user_id is null then raise exception 'not authenticated'; end if;

  select ai.* into v_item
  from public.assessment_items ai
  join public.content_items ci on ci.id = ai.content_item_id
  where ai.id = p_assessment_item_id
    and ai.content_item_id = p_content_item_id
    and ai.status = 'published'
    and ci.status = 'published'
    and ci.rights_status in ('internal','licensed','cleared');

  if not found then raise exception 'assessment unavailable'; end if;

  v_response := regexp_replace(lower(trim(coalesce(p_response,''))), '^[.!?¡¿]+|[.!?¡¿]+$', '', 'g');
  v_response := regexp_replace(v_response, '\s+', ' ', 'g');

  if v_item.scoring_strategy = 'choice_key' then
    v_success := coalesce(v_item.scoring_rules->'accepted_keys', '[]'::jsonb) ? v_response;
  elsif v_item.scoring_strategy = 'exact_text' then
    select exists (
      select 1
      from jsonb_array_elements_text(coalesce(v_item.scoring_rules->'accepted_answers','[]'::jsonb)) a(value)
      where regexp_replace(lower(trim(a.value)), '^[.!?¡¿]+|[.!?¡¿]+$', '', 'g') = v_response
    ) into v_success;
  elsif v_item.scoring_strategy = 'prefix_known_infinitive' then
    v_prefix := regexp_replace(lower(trim(coalesce(v_item.scoring_rules->>'prefix',''))), '^[.!?¡¿]+|[.!?¡¿]+$', '', 'g');
    if v_prefix <> '' and v_response like v_prefix || ' %' then
      v_first_word := split_part(substr(v_response, length(v_prefix) + 2), ' ', 1);
      v_success := coalesce(v_item.scoring_rules->'known_infinitives','[]'::jsonb) ? v_first_word;
    end if;
  end if;

  v_base := case v_item.evidence_type
    when 'recognition' then 0.20
    when 'meaning_recall' then 0.35
    when 'listening_comprehension' then 0.45
    when 'manipulation' then 0.55
    when 'guided_production' then 0.65
    when 'independent_production' then 0.80
    when 'spontaneous_transfer' then 1.00
    else 0.05
  end;

  v_self_generated := v_item.item_type = 'typed_response';
  v_strength := v_base;
  if v_item.hint_level > 0 then v_strength := v_strength * greatest(0.35, 1 - (0.18 * v_item.hint_level)); end if;
  if v_self_generated then v_strength := least(1.0, v_strength * 1.08); end if;

  v_error_class := case
    when v_success then null
    when v_item.evidence_type = 'manipulation' then 'form_or_conjugation'
    else 'retrieval_failure'
  end;

  insert into public.learner_evidence_events (
    learner_id, concept_id, content_item_id, modality, evidence_type,
    success, evidence_strength, hint_level, self_generated, error_class, metadata
  ) values (
    v_user_id, v_item.concept_id, p_content_item_id, 'web_interactive', v_item.evidence_type,
    v_success, v_strength, v_item.hint_level, v_self_generated, v_error_class,
    jsonb_build_object('assessment_item_id',v_item.id,'response_length',length(v_response))
  );

  return query select v_success, v_item.evidence_type, v_item.concept_id;
end;
$$;

revoke execute on function public.submit_assessment_response(uuid,uuid,text) from public, anon;
grant execute on function public.submit_assessment_response(uuid,uuid,text) to authenticated;
