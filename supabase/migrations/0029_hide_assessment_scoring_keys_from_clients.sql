revoke select on public.assessment_items from authenticated;

grant select (
  id,
  content_item_id,
  prompt,
  item_type,
  evidence_type,
  options,
  hint_level,
  sequence_number,
  status,
  stage_label,
  support_text,
  success_feedback,
  failure_feedback
) on public.assessment_items to authenticated;
