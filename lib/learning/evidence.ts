export type EvidenceType = 'exposure'|'recognition'|'meaning_recall'|'listening_comprehension'|'manipulation'|'guided_production'|'independent_production'|'spontaneous_transfer'

const base: Record<EvidenceType, number> = {
  exposure: .05, recognition: .20, meaning_recall: .35, listening_comprehension: .45,
  manipulation: .55, guided_production: .65, independent_production: .80, spontaneous_transfer: 1
}

export function evidenceStrength(type: EvidenceType, opts: {hintLevel?:number; delayed?:boolean; selfGenerated?:boolean; novelContext?:boolean} = {}) {
  let score = base[type]
  if ((opts.hintLevel ?? 0) > 0) score *= Math.max(.35, 1 - .18 * (opts.hintLevel ?? 0))
  if (opts.delayed) score *= 1.08
  if (opts.selfGenerated) score *= 1.08
  if (opts.novelContext) score *= 1.08
  return Math.min(1, Number(score.toFixed(4)))
}
