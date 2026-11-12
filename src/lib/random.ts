export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function randInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

/** Saca n elementos distintos al azar. */
export function sample<T>(items: readonly T[], n: number): T[] {
  return shuffle(items).slice(0, n)
}
