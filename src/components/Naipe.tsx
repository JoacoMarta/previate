import type { ReactNode } from 'react'
import type { Suit } from '../games/registry'
import { SuitIcon } from './Suit'

interface Props {
  suit: Suit
  index?: string
  kind?: string
  children: ReactNode
  /** Cambiar este valor dispara la animación de "repartir". */
  dealKey?: string | number
  colorOverride?: string
  /** Para mazo francés: símbolo de texto en lugar del dibujo del palo. */
  glyph?: string
}

export function Naipe({ suit, index, kind, children, dealKey, colorOverride, glyph }: Props) {
  const style = { ['--suit' as string]: colorOverride ?? (suit === 'oros' ? 'var(--oros-ink)' : `var(--${suit})`) }
  return (
    <article className="naipe is-entering" key={dealKey} style={style}>
      <div className="corner tl">
        {index && <span className="idx">{index}</span>}
        {glyph ? <span className="glyph">{glyph}</span> : <SuitIcon suit={suit} />}
      </div>
      <div className="corner br" aria-hidden="true">
        {index && <span className="idx">{index}</span>}
        {glyph ? <span className="glyph">{glyph}</span> : <SuitIcon suit={suit} />}
      </div>
      {kind && <div className="kind">{kind}</div>}
      {children}
    </article>
  )
}

/** Achica la letra cuando el texto es largo. */
export function promptClass(text: string) {
  return text.length > 110 ? 'prompt long' : 'prompt'
}
