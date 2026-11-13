const PIPS: Record<number, [number, number][]> = {
  1: [[16, 16]],
  2: [[9, 9], [23, 23]],
  3: [[9, 9], [16, 16], [23, 23]],
  4: [[9, 9], [23, 9], [9, 23], [23, 23]],
  5: [[9, 9], [23, 9], [16, 16], [9, 23], [23, 23]],
  6: [[9, 8], [23, 8], [9, 16], [23, 16], [9, 24], [23, 24]],
}

export function Die({ value, size = 88 }: { value: number; size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} role="img" aria-label={`Dado: ${value}`}>
      <rect x="1.5" y="1.5" width="29" height="29" rx="6" fill="var(--card)" stroke="var(--line)" strokeWidth="1" />
      {PIPS[value].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.8" fill={value === 1 ? 'var(--copas)' : 'var(--ink)'} />)}
    </svg>
  )
}
