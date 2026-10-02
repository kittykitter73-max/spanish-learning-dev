insert into public.characters (slug, display_name, description, status)
values
  ('camila','Camila','Practical, direct recurring character for household, timing, movement and everyday coordination.','draft'),
  ('nico','Nico','Curious, expressive recurring character for questions, learner-like mistakes and pattern discovery.','draft')
on conflict (slug) do update set display_name=excluded.display_name, description=excluded.description;

insert into public.speakers (slug, character_id, role, accent_region, register, default_speech_rate, status)
select 'camila-main', id, 'character', 'broad_latin_american', 'casual', 1.00, 'draft' from public.characters where slug='camila'
on conflict (slug) do update set character_id=excluded.character_id;
insert into public.speakers (slug, character_id, role, accent_region, register, default_speech_rate, status)
select 'nico-main', id, 'character', 'broad_latin_american', 'casual', 0.98, 'draft' from public.characters where slug='nico'
on conflict (slug) do update set character_id=excluded.character_id;

insert into public.content_items (slug,title,content_type,difficulty,language_ratio,content_rating,status,rights_status,provider_metadata)
values ('audio-lesson-002-repair-spanish','Wait — say that again.','micro_lesson',1,0.58,'general','language_qa','internal','{"working_brand":"Borao","prototype":"002","job":"conversation repair"}'::jsonb)
on conflict (slug) do update set title=excluded.title,status=excluded.status,provider_metadata=excluded.provider_metadata;

insert into public.content_concepts (content_item_id, concept_id, role)
select ci.id, x.concept_id, x.role
from public.content_items ci
cross join (values ('C035','active_target'),('C039','active_target'),('C034','active_target'),('C041','recycled'),('C043','recycled')) as x(concept_id,role)
where ci.slug='audio-lesson-002-repair-spanish'
on conflict do nothing;

insert into public.spoken_lessons (content_item_id,format,transfer_goal,estimated_seconds,production_notes)
select id,'micro_lesson','Learner repairs a too-fast or unclear Spanish interaction without switching immediately to English.',150,
  'Keep Camila natural-speed but clear. Nico should sound genuinely momentarily lost, not incompetent. Narrator stays brief.'
from public.content_items where slug='audio-lesson-002-repair-spanish'
on conflict (content_item_id) do update set transfer_goal=excluded.transfer_goal,estimated_seconds=excluded.estimated_seconds,production_notes=excluded.production_notes;

insert into public.spoken_lesson_segments (content_item_id,sequence_number,segment_type,speaker_id,text_es,text_en,expected_response_type,hint_level,pause_ms,metadata)
select ci.id,v.sequence_number,v.segment_type,s.id,v.text_es,v.text_en,v.expected_response_type,v.hint_level,v.pause_ms,v.metadata
from public.content_items ci
join (values
  (1,'dialogue','camila-main','¿Listo? Entonces vamos a salir ahora y después podemos pasar por la tienda.',null,'none',0,null,'{}'::jsonb),
  (2,'dialogue','nico-main','Perdón, no entiendo.',null,'none',0,null,'{}'::jsonb),
  (3,'dialogue','camila-main','Claro. Vamos a salir ahora.',null,'none',0,null,'{}'::jsonb),
  (4,'dialogue','nico-main','¿Puedes repetir? Más despacio, por favor.',null,'none',0,null,'{}'::jsonb),
  (5,'narration','narrator-main',null,'That is one of the most useful things you can do in real Spanish: control the conversation instead of abandoning it.','none',0,null,'{}'::jsonb),
  (6,'prompt','narrator-main',null,'You did not understand. Say it in Spanish.','guided_production',0,3000,'{"concept_id":"C035"}'::jsonb),
  (7,'model_answer','narrator-main','No entiendo.',null,'none',0,null,'{"concept_id":"C035"}'::jsonb),
  (8,'prompt','narrator-main',null,'Now ask: Can you repeat?','guided_production',0,3000,'{"concept_id":"C039"}'::jsonb),
  (9,'model_answer','narrator-main','¿Puedes repetir?',null,'none',0,null,'{"concept_id":"C039"}'::jsonb),
  (10,'prompt','narrator-main',null,'And if they are still too fast?','guided_production',0,3000,'{"concept_id":"C034"}'::jsonb),
  (11,'model_answer','narrator-main','Más despacio, por favor.',null,'none',0,null,'{"concept_id":"C034"}'::jsonb)
) as v(sequence_number,segment_type,speaker_slug,text_es,text_en,expected_response_type,hint_level,pause_ms,metadata)
on ci.slug='audio-lesson-002-repair-spanish'
join public.speakers s on s.slug=v.speaker_slug
on conflict (content_item_id,sequence_number) do update set segment_type=excluded.segment_type,speaker_id=excluded.speaker_id,text_es=excluded.text_es,text_en=excluded.text_en,expected_response_type=excluded.expected_response_type,hint_level=excluded.hint_level,pause_ms=excluded.pause_ms,metadata=excluded.metadata;

insert into public.assessment_items (slug,content_item_id,concept_id,prompt,item_type,evidence_type,options,scoring_strategy,scoring_rules,hint_level,sequence_number,status,stage_label,support_text,success_feedback,failure_feedback)
select v.slug,ci.id,v.concept_id,v.prompt,v.item_type,v.evidence_type,v.options,v.scoring_strategy,v.scoring_rules,v.hint_level,v.sequence_number,'qa',v.stage_label,v.support_text,v.success_feedback,v.failure_feedback
from public.content_items ci
join (values
 ('lesson002-recognize-no-entiendo','C035','What did Nico tell Camila?','multiple_choice','recognition','[{"key":"no_entiendo","label":"I don’t understand"},{"key":"no_puedo","label":"I can’t"},{"key":"no_se","label":"I don’t know"}]'::jsonb,'choice_key','{"accepted_keys":["no_entiendo"]}'::jsonb,0,1,'CATCH IT','Listen for the phrase after perdón.','Yes — no entiendo = I don’t understand.','Listen again for no entiendo.'),
 ('lesson002-retrieve-no-entiendo','C035','I don’t understand.','typed_response','guided_production','[]'::jsonb,'exact_text','{"accepted_answers":["no entiendo"]}'::jsonb,0,2,'SAY IT','No translating word by word. Retrieve the whole chunk.','Exactly. Keep no entiendo as one usable unit.','Try the complete chunk: no entiendo.'),
 ('lesson002-manipulate-puedes-repetir','C039','Turn the breakdown into a repair request: “Can you repeat?”','typed_response','manipulation','[]'::jsonb,'exact_text','{"accepted_answers":["puedes repetir","¿puedes repetir?"]}'::jsonb,0,3,'TAKE CONTROL','Use puedes + repetir.','Yes. Now you are controlling the conversation instead of escaping it.','Use puedes repetir.'),
 ('lesson002-produce-repair','C034','Someone is speaking Spanish too fast. Give one useful repair phrase.','typed_response','guided_production','[]'::jsonb,'exact_text','{"accepted_answers":["más despacio","más despacio por favor","más despacio, por favor","no entiendo","puedes repetir","¿puedes repetir?"]}'::jsonb,0,4,'YOUR TURN','Any one useful repair phrase from this scene counts.','Good. That is language you can actually use when the conversation gets hard.','Use no entiendo, puedes repetir, or más despacio.')
) as v(slug,concept_id,prompt,item_type,evidence_type,options,scoring_strategy,scoring_rules,hint_level,sequence_number,stage_label,support_text,success_feedback,failure_feedback)
on ci.slug='audio-lesson-002-repair-spanish'
on conflict (slug) do update set prompt=excluded.prompt,item_type=excluded.item_type,evidence_type=excluded.evidence_type,options=excluded.options,scoring_strategy=excluded.scoring_strategy,scoring_rules=excluded.scoring_rules,hint_level=excluded.hint_level,sequence_number=excluded.sequence_number,status=excluded.status,stage_label=excluded.stage_label,support_text=excluded.support_text,success_feedback=excluded.success_feedback,failure_feedback=excluded.failure_feedback;
