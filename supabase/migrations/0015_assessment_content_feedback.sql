alter table public.assessment_items
  add column if not exists stage_label text,
  add column if not exists support_text text,
  add column if not exists success_feedback text,
  add column if not exists failure_feedback text;

update public.assessment_items set
  stage_label = case slug
    when 'lesson001-recognize-quiero-comer' then 'CATCH IT'
    when 'lesson001-retrieve-quiero-ir' then 'SAY IT BEFORE WE SHOW IT'
    when 'lesson001-manipulate-voy-a-ir' then 'BEND IT'
    when 'lesson001-produce-tengo-que' then 'YOUR LIFE NOW'
  end,
  support_text = case slug
    when 'lesson001-recognize-quiero-comer' then 'Listen for “quiero comer.”'
    when 'lesson001-retrieve-quiero-ir' then 'Use quiero + action.'
    when 'lesson001-manipulate-voy-a-ir' then 'Keep the action ir. Change only the intention.'
    when 'lesson001-produce-tengo-que' then 'Start with tengo que. Use a real action you need today.'
  end,
  success_feedback = case slug
    when 'lesson001-recognize-quiero-comer' then 'Yes — quiero comer = I want to eat.'
    when 'lesson001-retrieve-quiero-ir' then 'Exactly. Quiero + action.'
    when 'lesson001-manipulate-voy-a-ir' then 'Yes. Same action, new intention.'
    when 'lesson001-produce-tengo-que' then 'That counts as real guided production.'
  end,
  failure_feedback = case slug
    when 'lesson001-recognize-quiero-comer' then 'Not quite. Listen for “quiero comer.”'
    when 'lesson001-retrieve-quiero-ir' then 'Not yet. Use the frame quiero + ir.'
    when 'lesson001-manipulate-voy-a-ir' then 'Almost. Use voy a + ir.'
    when 'lesson001-produce-tengo-que' then 'Use tengo que + one common action.'
  end
where slug like 'lesson001-%';
