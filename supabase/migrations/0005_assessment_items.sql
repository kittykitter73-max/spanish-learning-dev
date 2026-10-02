create table public.assessment_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  concept_id text not null references public.concepts(id) on delete cascade,
  prompt text not null,
  item_type text not null check (item_type in ('multiple_choice','typed_response')),
  evidence_type text not null check (evidence_type in ('recognition','meaning_recall','listening_comprehension','manipulation','guided_production','independent_production','spontaneous_transfer')),
  options jsonb not null default '[]'::jsonb,
  scoring_strategy text not null check (scoring_strategy in ('choice_key','exact_text','prefix_known_infinitive')),
  scoring_rules jsonb not null default '{}'::jsonb,
  hint_level smallint not null default 0 check (hint_level between 0 and 3),
  sequence_number integer not null,
  status text not null default 'draft' check (status in ('draft','qa','approved','published','retired')),
  created_at timestamptz not null default now(),
  unique (content_item_id, sequence_number)
);

create index assessment_items_content_idx on public.assessment_items(content_item_id);
create index assessment_items_concept_idx on public.assessment_items(concept_id);

alter table public.assessment_items enable row level security;

create policy assessment_items_read_published
on public.assessment_items
for select
to authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.content_items ci
    where ci.id = content_item_id
      and ci.status = 'published'
      and ci.rights_status in ('internal','licensed','cleared')
  )
);

grant select on public.assessment_items to authenticated;

insert into public.assessment_items (
  slug, content_item_id, concept_id, prompt, item_type, evidence_type,
  options, scoring_strategy, scoring_rules, hint_level, sequence_number, status
)
select
  v.slug,
  ci.id,
  v.concept_id,
  v.prompt,
  v.item_type,
  v.evidence_type,
  v.options,
  v.scoring_strategy,
  v.scoring_rules,
  v.hint_level,
  v.sequence_number,
  'published'
from public.content_items ci
join (values
  (
    'lesson001-recognize-quiero-comer',
    'C001',
    'What did Mateo want to do?',
    'multiple_choice',
    'recognition',
    '[{"key":"leave","label":"Leave"},{"key":"eat","label":"Eat"},{"key":"sleep","label":"Sleep"}]'::jsonb,
    'choice_key',
    '{"accepted_keys":["eat"]}'::jsonb,
    0,
    1
  ),
  (
    'lesson001-retrieve-quiero-ir',
    'C001',
    'I want to go.',
    'typed_response',
    'guided_production',
    '[]'::jsonb,
    'exact_text',
    '{"accepted_answers":["quiero ir"]}'::jsonb,
    0,
    2
  ),
  (
    'lesson001-manipulate-voy-a-ir',
    'C006',
    'Change “I want to go” into “I am going to go.”',
    'typed_response',
    'manipulation',
    '[]'::jsonb,
    'exact_text',
    '{"accepted_answers":["voy a ir"]}'::jsonb,
    0,
    3
  ),
  (
    'lesson001-produce-tengo-que',
    'C004',
    'Tell us one thing you actually have to do today.',
    'typed_response',
    'guided_production',
    '[]'::jsonb,
    'prefix_known_infinitive',
    '{"prefix":"tengo que","known_infinitives":["trabajar","comer","ir","dormir","salir","hacer","limpiar","llamar","comprar","estudiar","cocinar","manejar"]}'::jsonb,
    1,
    4
  )
) as v(slug,concept_id,prompt,item_type,evidence_type,options,scoring_strategy,scoring_rules,hint_level,sequence_number)
on ci.slug = 'audio-lesson-001-quiero-tengo-que-voy-a'
on conflict (slug) do update set
  prompt = excluded.prompt,
  item_type = excluded.item_type,
  evidence_type = excluded.evidence_type,
  options = excluded.options,
  scoring_strategy = excluded.scoring_strategy,
  scoring_rules = excluded.scoring_rules,
  hint_level = excluded.hint_level,
  sequence_number = excluded.sequence_number,
  status = excluded.status;
