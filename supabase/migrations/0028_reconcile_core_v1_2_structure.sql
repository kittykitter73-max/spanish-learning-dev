create table if not exists public.unit_concepts (
  unit_id uuid not null references public.learning_units(id) on delete cascade,
  concept_id text not null references public.concepts(id) on delete restrict,
  membership_role text not null default 'home' check (membership_role in ('home','recycle','support')),
  evidence_role text,
  scope text,
  curriculum_version text not null,
  created_at timestamptz not null default now(),
  primary key (unit_id, concept_id)
);

create index if not exists unit_concepts_concept_idx on public.unit_concepts(concept_id);

alter table public.unit_concepts enable row level security;

drop policy if exists unit_concepts_read_published on public.unit_concepts;
create policy unit_concepts_read_published
on public.unit_concepts
for select
to authenticated
using (
  exists (
    select 1
    from public.learning_units u
    join public.learning_paths p on p.id=u.path_id
    where u.id=unit_id
      and u.status='published'
      and p.status='published'
  )
);

revoke all on public.unit_concepts from anon, authenticated;
grant select on public.unit_concepts to authenticated;

insert into public.learning_paths (
  slug,title,path_kind,description,sort_order,status,metadata
) values (
  'core',
  'Core',
  'core',
  'The finite Borao foundation. Learner-facing progression follows ten functional chapters; internal authoring stages do not create separate learner levels.',
  1,
  'qa',
  jsonb_build_object('curriculum_version','1.2','chapter_count',10)
)
on conflict (slug) do update set
  title=excluded.title,
  description=excluded.description,
  sort_order=excluded.sort_order,
  status='qa',
  metadata=excluded.metadata,
  updated_at=now();

insert into public.learning_units (
  path_id,slug,title,sequence_number,transfer_goal,status,metadata
) values
((select id from public.learning_paths where slug='core'), 'core-01-make-something-happen', 'Make Something Happen', 1, 'Express wants, needs, obligation, intention, ability and inability.', 'qa', jsonb_build_object('curriculum_version','1.2','learner_label','Make Something Happen')),
((select id from public.learning_paths where slug='core'), 'core-02-you-me-lets', 'You, Me, Let’s', 2, 'Coordinate with another person through requests, offers and shared action.', 'qa', jsonb_build_object('curriculum_version','1.2','learner_label','You, Me, Let’s')),
((select id from public.learning_paths where slug='core'), 'core-03-ask-anything', 'Ask Anything', 3, 'Ask high-value information questions and understand what kind of answer is needed.', 'qa', jsonb_build_object('curriculum_version','1.2','learner_label','Ask Anything')),
((select id from public.learning_paths where slug='core'), 'core-04-stay-in-the-conversation', 'Stay in the Conversation', 4, 'Repair misunderstanding, clarify meaning and keep an exchange moving.', 'qa', jsonb_build_object('curriculum_version','1.2','learner_label','Stay in the Conversation')),
((select id from public.learning_paths where slug='core'), 'core-05-now-later-before', 'Now, Later, Before', 5, 'Coordinate simple timing, sequence and readiness.', 'qa', jsonb_build_object('curriculum_version','1.2','learner_label','Now, Later, Before')),
((select id from public.learning_paths where slug='core'), 'core-06-where-are-we', 'Where Are We?', 6, 'Understand existence, location, destination and movement through space.', 'qa', jsonb_build_object('curriculum_version','1.2','learner_label','Where Are We?')),
((select id from public.learning_paths where slug='core'), 'core-07-everyday-life', 'Everyday Life', 7, 'Understand and talk through common daily actions and routines.', 'qa', jsonb_build_object('curriculum_version','1.2','learner_label','Everyday Life')),
((select id from public.learning_paths where slug='core'), 'core-08-get-things-done', 'Get Things Done', 8, 'Handle practical requests, objects, help and everyday task coordination.', 'qa', jsonb_build_object('curriculum_version','1.2','learner_label','Get Things Done')),
((select id from public.learning_paths where slug='core'), 'core-09-me-you-how-things-are', 'Me, You, and How Things Are', 9, 'Express preference, identity and state in basic social description.', 'qa', jsonb_build_object('curriculum_version','1.2','learner_label','Me, You, and How Things Are')),
((select id from public.learning_paths where slug='core'), 'core-10-keep-up', 'Keep Up', 10, 'Combine the Core repertoire with less support and unfamiliar voices.', 'qa', jsonb_build_object('curriculum_version','1.2','learner_label','Keep Up'))
on conflict (path_id,slug) do update set
  title=excluded.title,
  sequence_number=excluded.sequence_number,
  transfer_goal=excluded.transfer_goal,
  status='qa',
  metadata=excluded.metadata,
  updated_at=now();

insert into public.unit_concepts (
  unit_id,concept_id,membership_role,evidence_role,scope,curriculum_version
) values
((select id from public.learning_units where slug='core-01-make-something-happen' and path_id=(select id from public.learning_paths where slug='core')), 'C001', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-01-make-something-happen' and path_id=(select id from public.learning_paths where slug='core')), 'C002', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-09-me-you-how-things-are' and path_id=(select id from public.learning_paths where slug='core')), 'C003', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-01-make-something-happen' and path_id=(select id from public.learning_paths where slug='core')), 'C004', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C005', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-01-make-something-happen' and path_id=(select id from public.learning_paths where slug='core')), 'C006', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-01-make-something-happen' and path_id=(select id from public.learning_paths where slug='core')), 'C007', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-01-make-something-happen' and path_id=(select id from public.learning_paths where slug='core')), 'C008', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-04-stay-in-the-conversation' and path_id=(select id from public.learning_paths where slug='core')), 'C009', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-04-stay-in-the-conversation' and path_id=(select id from public.learning_paths where slug='core')), 'C010', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-09-me-you-how-things-are' and path_id=(select id from public.learning_paths where slug='core')), 'C011', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-09-me-you-how-things-are' and path_id=(select id from public.learning_paths where slug='core')), 'C012', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C013', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C014', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C015', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-09-me-you-how-things-are' and path_id=(select id from public.learning_paths where slug='core')), 'C016', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-02-you-me-lets' and path_id=(select id from public.learning_paths where slug='core')), 'C017', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-02-you-me-lets' and path_id=(select id from public.learning_paths where slug='core')), 'C018', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-02-you-me-lets' and path_id=(select id from public.learning_paths where slug='core')), 'C019', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-02-you-me-lets' and path_id=(select id from public.learning_paths where slug='core')), 'C020', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-02-you-me-lets' and path_id=(select id from public.learning_paths where slug='core')), 'C021', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-02-you-me-lets' and path_id=(select id from public.learning_paths where slug='core')), 'C022', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-02-you-me-lets' and path_id=(select id from public.learning_paths where slug='core')), 'C023', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-02-you-me-lets' and path_id=(select id from public.learning_paths where slug='core')), 'C024', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-03-ask-anything' and path_id=(select id from public.learning_paths where slug='core')), 'C025', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-03-ask-anything' and path_id=(select id from public.learning_paths where slug='core')), 'C026', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-03-ask-anything' and path_id=(select id from public.learning_paths where slug='core')), 'C027', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-03-ask-anything' and path_id=(select id from public.learning_paths where slug='core')), 'C028', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-03-ask-anything' and path_id=(select id from public.learning_paths where slug='core')), 'C029', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-03-ask-anything' and path_id=(select id from public.learning_paths where slug='core')), 'C030', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-03-ask-anything' and path_id=(select id from public.learning_paths where slug='core')), 'C031', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-03-ask-anything' and path_id=(select id from public.learning_paths where slug='core')), 'C032', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-04-stay-in-the-conversation' and path_id=(select id from public.learning_paths where slug='core')), 'C033', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-04-stay-in-the-conversation' and path_id=(select id from public.learning_paths where slug='core')), 'C034', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-04-stay-in-the-conversation' and path_id=(select id from public.learning_paths where slug='core')), 'C035', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-04-stay-in-the-conversation' and path_id=(select id from public.learning_paths where slug='core')), 'C036', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-04-stay-in-the-conversation' and path_id=(select id from public.learning_paths where slug='core')), 'C037', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-04-stay-in-the-conversation' and path_id=(select id from public.learning_paths where slug='core')), 'C038', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-04-stay-in-the-conversation' and path_id=(select id from public.learning_paths where slug='core')), 'C039', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-04-stay-in-the-conversation' and path_id=(select id from public.learning_paths where slug='core')), 'C040', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-02-you-me-lets' and path_id=(select id from public.learning_paths where slug='core')), 'C041', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-02-you-me-lets' and path_id=(select id from public.learning_paths where slug='core')), 'C042', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-02-you-me-lets' and path_id=(select id from public.learning_paths where slug='core')), 'C043', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-05-now-later-before' and path_id=(select id from public.learning_paths where slug='core')), 'C044', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-05-now-later-before' and path_id=(select id from public.learning_paths where slug='core')), 'C045', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-05-now-later-before' and path_id=(select id from public.learning_paths where slug='core')), 'C046', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-05-now-later-before' and path_id=(select id from public.learning_paths where slug='core')), 'C047', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-05-now-later-before' and path_id=(select id from public.learning_paths where slug='core')), 'C048', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-05-now-later-before' and path_id=(select id from public.learning_paths where slug='core')), 'C049', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-05-now-later-before' and path_id=(select id from public.learning_paths where slug='core')), 'C050', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-05-now-later-before' and path_id=(select id from public.learning_paths where slug='core')), 'C051', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C052', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C053', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C054', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C055', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C056', 'home', 'functional_chunk_or_sense', 'Assess the declared function in context; production only where the Arc mission calls for it.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C057', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C058', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-07-everyday-life' and path_id=(select id from public.learning_paths where slug='core')), 'C059', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-09-me-you-how-things-are' and path_id=(select id from public.learning_paths where slug='core')), 'C060', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-01-make-something-happen' and path_id=(select id from public.learning_paths where slug='core')), 'C061', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-01-make-something-happen' and path_id=(select id from public.learning_paths where slug='core')), 'C062', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-01-make-something-happen' and path_id=(select id from public.learning_paths where slug='core')), 'C063', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-09-me-you-how-things-are' and path_id=(select id from public.learning_paths where slug='core')), 'C064', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-09-me-you-how-things-are' and path_id=(select id from public.learning_paths where slug='core')), 'C065', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-04-stay-in-the-conversation' and path_id=(select id from public.learning_paths where slug='core')), 'C066', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-04-stay-in-the-conversation' and path_id=(select id from public.learning_paths where slug='core')), 'C067', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-07-everyday-life' and path_id=(select id from public.learning_paths where slug='core')), 'C068', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-08-get-things-done' and path_id=(select id from public.learning_paths where slug='core')), 'C069', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-08-get-things-done' and path_id=(select id from public.learning_paths where slug='core')), 'C070', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-07-everyday-life' and path_id=(select id from public.learning_paths where slug='core')), 'C071', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-08-get-things-done' and path_id=(select id from public.learning_paths where slug='core')), 'C072', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-08-get-things-done' and path_id=(select id from public.learning_paths where slug='core')), 'C073', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-08-get-things-done' and path_id=(select id from public.learning_paths where slug='core')), 'C074', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-01-make-something-happen' and path_id=(select id from public.learning_paths where slug='core')), 'C075', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-07-everyday-life' and path_id=(select id from public.learning_paths where slug='core')), 'C076', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-01-make-something-happen' and path_id=(select id from public.learning_paths where slug='core')), 'C077', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-07-everyday-life' and path_id=(select id from public.learning_paths where slug='core')), 'C078', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-07-everyday-life' and path_id=(select id from public.learning_paths where slug='core')), 'C079', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-07-everyday-life' and path_id=(select id from public.learning_paths where slug='core')), 'C080', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-07-everyday-life' and path_id=(select id from public.learning_paths where slug='core')), 'C081', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-08-get-things-done' and path_id=(select id from public.learning_paths where slug='core')), 'C082', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-08-get-things-done' and path_id=(select id from public.learning_paths where slug='core')), 'C083', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-08-get-things-done' and path_id=(select id from public.learning_paths where slug='core')), 'C084', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-07-everyday-life' and path_id=(select id from public.learning_paths where slug='core')), 'C085', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C086', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C087', 'home', 'lexical_scaffold_with_scoped_form_observations', 'Use the forms and senses required by the Arc mission; no full lemma/paradigm gate.', '1.2'),
((select id from public.learning_units where slug='core-07-everyday-life' and path_id=(select id from public.learning_paths where slug='core')), 'C088', 'home', 'scoped_construction_support', 'Record only sampled patterns, people and meanings; broad grammar label is not a comprehensive gate.', '1.2'),
((select id from public.learning_units where slug='core-10-keep-up' and path_id=(select id from public.learning_paths where slug='core')), 'C089', 'home', 'scoped_construction_support', 'Record only sampled patterns, people and meanings; broad grammar label is not a comprehensive gate.', '1.2'),
((select id from public.learning_units where slug='core-01-make-something-happen' and path_id=(select id from public.learning_paths where slug='core')), 'C090', 'home', 'scoped_construction_support', 'Record only sampled patterns, people and meanings; broad grammar label is not a comprehensive gate.', '1.2'),
((select id from public.learning_units where slug='core-07-everyday-life' and path_id=(select id from public.learning_paths where slug='core')), 'C091', 'home', 'scoped_construction_support', 'Record only sampled patterns, people and meanings; broad grammar label is not a comprehensive gate.', '1.2'),
((select id from public.learning_units where slug='core-03-ask-anything' and path_id=(select id from public.learning_paths where slug='core')), 'C092', 'home', 'scoped_construction_support', 'Record only sampled patterns, people and meanings; broad grammar label is not a comprehensive gate.', '1.2'),
((select id from public.learning_units where slug='core-09-me-you-how-things-are' and path_id=(select id from public.learning_paths where slug='core')), 'C093', 'home', 'scoped_construction_support', 'Record only sampled patterns, people and meanings; broad grammar label is not a comprehensive gate.', '1.2'),
((select id from public.learning_units where slug='core-06-where-are-we' and path_id=(select id from public.learning_paths where slug='core')), 'C094', 'home', 'scoped_construction_support', 'Record only sampled patterns, people and meanings; broad grammar label is not a comprehensive gate.', '1.2'),
((select id from public.learning_units where slug='core-09-me-you-how-things-are' and path_id=(select id from public.learning_paths where slug='core')), 'C095', 'home', 'scoped_construction_support', 'Record only sampled patterns, people and meanings; broad grammar label is not a comprehensive gate.', '1.2'),
((select id from public.learning_units where slug='core-10-keep-up' and path_id=(select id from public.learning_paths where slug='core')), 'C096', 'home', 'receptive_or_intelligibility_support', 'Demonstrate intelligibility or interpret a reviewed familiar contrast; no native-accent or perfect-trill gate.', '1.2'),
((select id from public.learning_units where slug='core-10-keep-up' and path_id=(select id from public.learning_paths where slug='core')), 'C097', 'home', 'receptive_or_intelligibility_support', 'Demonstrate intelligibility or interpret a reviewed familiar contrast; no native-accent or perfect-trill gate.', '1.2'),
((select id from public.learning_units where slug='core-03-ask-anything' and path_id=(select id from public.learning_paths where slug='core')), 'C098', 'home', 'receptive_or_intelligibility_support', 'Demonstrate intelligibility or interpret a reviewed familiar contrast; no native-accent or perfect-trill gate.', '1.2'),
((select id from public.learning_units where slug='core-04-stay-in-the-conversation' and path_id=(select id from public.learning_paths where slug='core')), 'C099', 'home', 'receptive_or_intelligibility_support', 'Demonstrate intelligibility or interpret a reviewed familiar contrast; no native-accent or perfect-trill gate.', '1.2'),
((select id from public.learning_units where slug='core-10-keep-up' and path_id=(select id from public.learning_paths where slug='core')), 'C100', 'home', 'receptive_or_intelligibility_support', 'Demonstrate intelligibility or interpret a reviewed familiar contrast; no native-accent or perfect-trill gate.', '1.2')
on conflict (unit_id,concept_id) do update set
  membership_role=excluded.membership_role,
  evidence_role=excluded.evidence_role,
  scope=excluded.scope,
  curriculum_version=excluded.curriculum_version;
