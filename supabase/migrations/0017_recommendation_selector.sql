create or replace function public.refresh_next_recommendation(p_learner_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_content_id uuid;
  v_score numeric(10,4);
  v_reasons text[];
begin
  update public.recommendations set consumed_at = coalesce(consumed_at, now()) where learner_id = p_learner_id and consumed_at is null;

  with eligible as (
    select ci.id content_item_id,
      count(*) filter (where cc.role='active_target' and lcs.due_at is not null and lcs.due_at <= now()) due_targets,
      count(*) filter (where cc.role='active_target' and lcs.learner_id is null) unseen_targets,
      count(*) filter (where cc.role='active_target' and lcs.recent_error_class is not null) error_targets,
      avg(case when cc.role='active_target' then 1 - coalesce(lcs.production_confidence,0) end) production_gap,
      max(lcp.completed_at) completed_at
    from public.content_items ci
    join public.content_concepts cc on cc.content_item_id=ci.id
    left join public.learner_concept_state lcs on lcs.learner_id=p_learner_id and lcs.concept_id=cc.concept_id
    left join public.learner_content_progress lcp on lcp.learner_id=p_learner_id and lcp.content_item_id=ci.id
    left join public.learner_profiles lp on lp.id=p_learner_id
    where ci.status='published' and ci.rights_status in ('internal','licensed','cleared')
      and (ci.content_rating='general' or (ci.content_rating='teen' and lp.allowed_content_rating in ('teen','mature_18')) or (ci.content_rating='mature_18' and lp.allowed_content_rating='mature_18' and lp.mature_content_enabled))
    group by ci.id
  ), scored as (
    select content_item_id,
      (due_targets*2.2 + error_targets*1.8 + unseen_targets*.9 + coalesce(production_gap,1)*1.5 + case when completed_at is null then .7 else 0 end - case when completed_at is not null and completed_at > now()-interval '12 hours' then 1.4 else 0 end)::numeric(10,4) score,
      array_remove(array[case when due_targets>0 then 'due_review' end,case when error_targets>0 then 'recent_error' end,case when unseen_targets>0 then 'new_target' end,case when coalesce(production_gap,1)>=.55 then 'production_gap' end,case when completed_at is null then 'not_completed' end],null) reasons
    from eligible
  )
  select content_item_id,score,reasons into v_content_id,v_score,v_reasons from scored order by score desc,content_item_id limit 1;

  if v_content_id is not null then
    insert into public.recommendations(learner_id,content_item_id,recommendation_type,score,reason_codes,explanation)
    values(p_learner_id,v_content_id,'next_best_content',v_score,coalesce(v_reasons,'{}'),jsonb_build_object('selector_version','v0.1','generated_at',now()));
  end if;
  return v_content_id;
end;
$$;
revoke execute on function public.refresh_next_recommendation(uuid) from public, anon, authenticated;
grant execute on function public.refresh_next_recommendation(uuid) to postgres, service_role;

create or replace function public.refresh_recommendation_after_onboarding()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.onboarding_completed_at is not null and old.onboarding_completed_at is distinct from new.onboarding_completed_at then
    perform public.refresh_next_recommendation(new.id);
  end if;
  return new;
end;
$$;
revoke execute on function public.refresh_recommendation_after_onboarding() from public, anon, authenticated;
grant execute on function public.refresh_recommendation_after_onboarding() to postgres, service_role;
drop trigger if exists learner_profile_refresh_recommendation on public.learner_profiles;
create trigger learner_profile_refresh_recommendation after update of onboarding_completed_at on public.learner_profiles for each row execute procedure public.refresh_recommendation_after_onboarding();
