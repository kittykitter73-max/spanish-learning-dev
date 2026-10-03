create or replace function public.save_content_progress(
  p_content_item_id uuid,
  p_stage text,
  p_completed boolean default false
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then raise exception 'not authenticated'; end if;
  if p_stage not in ('scene','recognition','retrieve','manipulate','produce','done') then raise exception 'invalid stage'; end if;
  if not exists (
    select 1 from public.content_items ci
    where ci.id=p_content_item_id and ci.status='published' and ci.rights_status in ('internal','licensed','cleared')
  ) then raise exception 'content unavailable'; end if;

  insert into public.learner_content_progress(
    learner_id,content_item_id,current_stage,completed_at,last_interaction_at
  ) values (
    v_user_id,p_content_item_id,p_stage,case when p_completed then now() end,now()
  )
  on conflict (learner_id,content_item_id) do update set
    replay_count = case
      when public.learner_content_progress.completed_at is not null and p_stage='scene'
        then public.learner_content_progress.replay_count + 1
      else public.learner_content_progress.replay_count
    end,
    current_stage = excluded.current_stage,
    completed_at = case
      when p_completed then now()
      when p_stage='scene' and public.learner_content_progress.completed_at is not null then null
      else public.learner_content_progress.completed_at
    end,
    last_interaction_at=now();

  if p_completed then
    perform public.refresh_next_recommendation(v_user_id);
  end if;
end;
$$;
revoke execute on function public.save_content_progress(uuid,text,boolean) from public, anon;
grant execute on function public.save_content_progress(uuid,text,boolean) to authenticated;
