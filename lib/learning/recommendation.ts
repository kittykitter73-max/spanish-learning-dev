export type Candidate = {
  due:number; prerequisiteGap:number; newTarget:number; errorRelevance:number; modalityDiversity:number;
  goalRelevance:number; preferenceFit:number; novelty:number; duplicatePenalty:number; frustrationPenalty:number
}

export function recommendationScore(c: Candidate) {
  return Number((
    c.due*2.2 + c.prerequisiteGap*2 + c.newTarget*1.2 + c.errorRelevance*1.8 + c.modalityDiversity*.8 +
    c.goalRelevance*1.1 + c.preferenceFit*.55 + c.novelty*.45 - c.duplicatePenalty*1.5 - c.frustrationPenalty*1.4
  ).toFixed(4))
}
