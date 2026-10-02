insert into public.concepts (id, slug, concept_type, canonical_spanish, canonical_english, communicative_function, difficulty, status)
values
  ('C001','quiero_infinitive','sentence_frame','quiero + infinitivo','I want to + verb','express desire/intention',1,'published'),
  ('C004','tengo_que_infinitive','sentence_frame','tengo que + infinitivo','I have to + verb','express obligation',1,'published'),
  ('C006','voy_a_infinitive','sentence_frame','voy a + infinitivo','I am going to + verb','express near-future intention',1,'published')
on conflict (id) do update set
  slug = excluded.slug,
  canonical_spanish = excluded.canonical_spanish,
  canonical_english = excluded.canonical_english,
  communicative_function = excluded.communicative_function,
  status = excluded.status;

with upserted as (
  insert into public.characters (slug, display_name, description, status)
  values
    ('sofia','Sofía','Warm, socially confident recurring character for everyday casual speech.','published'),
    ('mateo','Mateo','Playful recurring character for humor, repair, slang and natural dialogue.','published')
  on conflict (slug) do update set display_name = excluded.display_name, description = excluded.description, status = excluded.status
  returning id, slug
)
select 1;

insert into public.speakers (slug, character_id, role, accent_region, register, default_speech_rate, status)
select 'sofia-main', c.id, 'character', 'broad_latin_american', 'casual', 0.95, 'published'
from public.characters c where c.slug='sofia'
on conflict (slug) do update set character_id=excluded.character_id, status=excluded.status;

insert into public.speakers (slug, character_id, role, accent_region, register, default_speech_rate, status)
select 'mateo-main', c.id, 'character', 'broad_latin_american', 'casual', 1.00, 'published'
from public.characters c where c.slug='mateo'
on conflict (slug) do update set character_id=excluded.character_id, status=excluded.status;

insert into public.speakers (slug, character_id, role, accent_region, register, default_speech_rate, status)
values ('narrator-main', null, 'narrator', 'broad_latin_american', 'instructional_casual', 0.95, 'published')
on conflict (slug) do update set status=excluded.status;

insert into public.content_items (slug, title, content_type, difficulty, language_ratio, content_rating, status, rights_status, provider_metadata)
values (
  'audio-lesson-001-quiero-tengo-que-voy-a',
  'Want. Have to. Going to.',
  'micro_lesson',
  1,
  0.48,
  'general',
  'published',
  'internal',
  '{"working_brand":"Borao","prototype":"001"}'::jsonb
)
on conflict (slug) do update set title=excluded.title, status=excluded.status, rights_status=excluded.rights_status;

insert into public.content_concepts (content_item_id, concept_id, role)
select ci.id, x.concept_id, 'active_target'
from public.content_items ci
cross join (values ('C001'),('C004'),('C006')) as x(concept_id)
where ci.slug='audio-lesson-001-quiero-tengo-que-voy-a'
on conflict do nothing;

insert into public.spoken_lessons (content_item_id, format, transfer_goal, estimated_seconds, production_notes)
select id, 'micro_lesson', 'Learner produces all three frames with personally relevant infinitives.', 165,
  'Narrator concise; characters natural; retrieval pauses silent; no meditation ambience.'
from public.content_items where slug='audio-lesson-001-quiero-tengo-que-voy-a'
on conflict (content_item_id) do update set transfer_goal=excluded.transfer_goal, estimated_seconds=excluded.estimated_seconds;

-- Seed only the first scene and first retrieval loop; later script segments can be expanded without schema changes.
insert into public.spoken_lesson_segments (content_item_id, sequence_number, segment_type, speaker_id, text_es, text_en, expected_response_type, hint_level, pause_ms, metadata)
select ci.id, v.sequence_number, v.segment_type, s.id, v.text_es, v.text_en, v.expected_response_type, v.hint_level, v.pause_ms, v.metadata
from public.content_items ci
join (values
  (1,'dialogue','sofia-main','¿Ya nos vamos?',null,'none',0,null,'{}'::jsonb),
  (2,'dialogue','mateo-main','Todavía no. Quiero comer primero.',null,'none',0,null,'{}'::jsonb),
  (3,'dialogue','sofia-main','¿Comer? Mateo, tenemos que irnos.',null,'none',0,null,'{}'::jsonb),
  (4,'dialogue','mateo-main','Sí, sí. Voy a comer rápido.',null,'none',0,null,'{}'::jsonb),
  (5,'narration','narrator-main',null,'You caught more of that than you think. First: quiero comer. Hear the shape: quiero + action.','none',0,null,'{}'::jsonb),
  (6,'prompt','narrator-main',null,'Your turn. I want to go. Say it before I do.','guided_production',0,3000,'{"concept_id":"C001"}'::jsonb),
  (7,'model_answer','narrator-main','Quiero ir.',null,'none',0,null,'{"concept_id":"C001"}'::jsonb),
  (8,'prompt','narrator-main',null,'I have to work.','guided_production',0,3000,'{"concept_id":"C004"}'::jsonb),
  (9,'model_answer','narrator-main','Tengo que trabajar.',null,'none',0,null,'{"concept_id":"C004"}'::jsonb),
  (10,'prompt','narrator-main',null,'I am going to work.','guided_production',0,3000,'{"concept_id":"C006"}'::jsonb),
  (11,'model_answer','narrator-main','Voy a trabajar.',null,'none',0,null,'{"concept_id":"C006"}'::jsonb)
) as v(sequence_number,segment_type,speaker_slug,text_es,text_en,expected_response_type,hint_level,pause_ms,metadata)
on ci.slug='audio-lesson-001-quiero-tengo-que-voy-a'
join public.speakers s on s.slug=v.speaker_slug
on conflict (content_item_id, sequence_number) do update set
  segment_type=excluded.segment_type,
  speaker_id=excluded.speaker_id,
  text_es=excluded.text_es,
  text_en=excluded.text_en,
  expected_response_type=excluded.expected_response_type,
  hint_level=excluded.hint_level,
  pause_ms=excluded.pause_ms,
  metadata=excluded.metadata;
