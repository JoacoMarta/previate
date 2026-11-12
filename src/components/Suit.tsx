import type { Suit } from '../games/registry'

export function SuitIcon({ suit, className }: { suit: Suit; className?: string }) {
  const color = `var(--${suit})`
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" style={{ color }}>
      {suit === 'oros' && (
        <>
          <circle cx="16" cy="16" r="13" fill="currentColor" />
          <circle cx="16" cy="16" r="8.5" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" />
          <circle cx="16" cy="16" r="3" fill="#fff" fillOpacity="0.55" />
        </>
      )}
      {suit === 'copas' && (
        <>
          <path d="M6.5 6h19c0 7.5-4 11.6-8 12.6v5.2c0 1.4 4 1.9 5 3.7h-13c1-1.8 5-2.3 5-3.7v-5.2c-4-1-8-5.1-8-12.6z" fill="currentColor" />
          <rect x="6" y="4.2" width="20" height="3.2" rx="1.6" fill="currentColor" />
        </>
      )}
      {suit === 'espadas' && (
        <>
          <path d="M16 1.5l3 4.2v15.8h-6V5.7z" fill="currentColor" />
          <rect x="7.5" y="20.5" width="17" height="3.4" rx="1.7" fill="currentColor" />
          <rect x="14.4" y="23.5" width="3.2" height="5" fill="currentColor" />
          <circle cx="16" cy="29.4" r="2" fill="currentColor" />
        </>
      )}
      {suit === 'bastos' && (
        <>
          <path d="M13.2 29.5c-.4-9.5-2.6-15.6-3-20.6-.4-5 2.4-7.4 5.8-7.4s6.2 2.4 5.8 7.4c-.4 5-2.6 11.1-3 20.6z" fill="currentColor" />
          <circle cx="9.6" cy="13.2" r="2" fill="currentColor" />
          <circle cx="22.2" cy="18.6" r="1.8" fill="currentColor" />
          <circle cx="10.8" cy="21.4" r="1.4" fill="currentColor" />
        </>
      )}
    </svg>
  )
}
