import type { FrenchSuit as FS } from '../lib/deck'

/** Palos franceses dibujados (sin glifos de texto). */
export function FrenchSuitIcon({ suit, className }: { suit: FS; className?: string }) {
  const red = suit === 'corazones' || suit === 'diamantes'
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" style={{ color: red ? 'var(--copas)' : 'var(--ink)' }}>
      {suit === 'corazones' && <path d="M16 28.5C8.6 22.6 3.5 18 3.5 11.9 3.5 7.9 6.6 5 10.3 5c2.5 0 4.5 1.4 5.7 3.4C17.2 6.4 19.2 5 21.7 5c3.7 0 6.8 2.9 6.8 6.9 0 6.1-5.1 10.7-12.5 16.6z" fill="currentColor" />}
      {suit === 'diamantes' && <path d="M16 2.5l10.5 13.5L16 29.5 5.5 16z" fill="currentColor" />}
      {suit === 'picas' && (
        <>
          <path d="M16 3c-6.6 6.2-12 10.3-12 15.4 0 3.4 2.6 5.8 5.8 5.8 2.4 0 4.2-1.3 5.2-3.2-.2 3.2-1.4 5.6-3.4 7.5h8.8c-2-1.9-3.2-4.3-3.4-7.5 1 1.9 2.8 3.2 5.2 3.2 3.2 0 5.8-2.4 5.8-5.8C28 13.3 22.6 9.2 16 3z" fill="currentColor" />
        </>
      )}
      {suit === 'treboles' && (
        <>
          <circle cx="16" cy="9.5" r="6" fill="currentColor" />
          <circle cx="9.2" cy="18" r="6" fill="currentColor" />
          <circle cx="22.8" cy="18" r="6" fill="currentColor" />
          <path d="M14.6 17h2.8c.3 4.6 1.5 8.2 3.8 11.5h-10.4c2.3-3.3 3.5-6.9 3.8-11.5z" fill="currentColor" />
        </>
      )}
    </svg>
  )
}
