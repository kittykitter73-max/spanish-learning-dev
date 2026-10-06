-- Borao security boundary regression assertions.
-- Run against a non-production/staging database after migrations.
-- This file is intentionally read-only except for the DO block itself.

do $$
begin
  if has_table_privilege('authenticated','public.learner_evidence_events','INSERT,UPDATE,DELETE') then
    raise exception 'authenticated must not write learner_evidence_events directly';
  end if;

  if has_table_privilege('authenticated','public.learner_concept_state','INSERT,UPDATE,DELETE') then
    raise exception 'authenticated must not write learner_concept_state directly';
  end if;

  if has_table_privilege('authenticated','public.recommendations','INSERT,UPDATE,DELETE') then
    raise exception 'authenticated must not write recommendations directly';
  end if;

  if has_table_privilege('authenticated','public.learner_content_progress','INSERT,UPDATE,DELETE') then
    raise exception 'authenticated must not write learner_content_progress directly';
  end if;

  if has_table_privilege('authenticated','public.learner_unit_state','INSERT,UPDATE,DELETE') then
    raise exception 'authenticated must not write learner_unit_state directly';
  end if;

  if has_table_privilege('authenticated','public.learner_unlocks','INSERT,DELETE') then
    raise exception 'authenticated must not create or delete learner unlocks';
  end if;

  if not has_column_privilege('authenticated','public.learner_unlocks','seen_at','UPDATE') then
    raise exception 'authenticated should be able to acknowledge own unlock via seen_at';
  end if;

  if has_column_privilege('authenticated','public.learner_unlocks','content_item_id','UPDATE')
     or has_column_privilege('authenticated','public.learner_unlocks','collection_id','UPDATE')
     or has_column_privilege('authenticated','public.learner_unlocks','game_id','UPDATE')
     or has_column_privilege('authenticated','public.learner_unlocks','feature_key','UPDATE')
     or has_column_privilege('authenticated','public.learner_unlocks','learner_id','UPDATE') then
    raise exception 'authenticated must not retarget unlocks';
  end if;

  if not has_table_privilege('authenticated','public.playlists','INSERT,SELECT,UPDATE,DELETE') then
    raise exception 'playlist CRUD grant missing';
  end if;

  if not has_table_privilege('authenticated','public.learner_media_progress','INSERT,SELECT,UPDATE,DELETE') then
    raise exception 'media progress CRUD grant missing';
  end if;
end $$;
