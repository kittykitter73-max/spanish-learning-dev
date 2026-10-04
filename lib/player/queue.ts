export type QueueItem = {
  id: string
  title: string
  subtitle?: string
}

export function boundedIndex(length: number, index: number) {
  if (length <= 0) return -1
  return Math.min(Math.max(index, 0), length - 1)
}

export function nextQueueIndex(length: number, index: number) {
  const current = boundedIndex(length, index)
  if (current < 0 || current >= length - 1) return -1
  return current + 1
}

export function previousQueueIndex(length: number, index: number) {
  const current = boundedIndex(length, index)
  if (current <= 0) return -1
  return current - 1
}

export function formatPlaybackTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const whole = Math.floor(seconds)
  const minutes = Math.floor(whole / 60)
  const remainder = whole % 60
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}
