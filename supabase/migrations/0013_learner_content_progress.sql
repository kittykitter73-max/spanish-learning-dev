create table public.learner_content_progress (
  learner_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  current_stage text not null default 'scene' check (current_stage in ('scene','recognition','retrieve','manipulate','produce','done')),
  started_at timestamptz not null default now(),
  last_interaction_at timestamptz not null default now(),
  completed_at timestamptz,
  replay_count integer not null default 0,
  primary key (learner_id, content_item_id)
);

create index learner_content_progress_recent_idx on public.learner_content_progress(learner_id,last_interaction_at desc);
alter table public.learner_content_progress enable row level security;
create policy learner_content_progress_select_own on public.learner_content_progress
  for select to authenticated using ((select auth.uid()) = learner_id);
revoke all on public.learner_content_progress from anon, authenticated;
grant select on public.learner_content_progress to authenticated;

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
end;
$$;
revoke execute on function public.save_content_progress(uuid,text,boolean) from public, anon;
grant execute on function public.save_content_progress(uuid,text,boolean) to authenticated;
