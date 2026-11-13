import type { ReactNode } from 'react'
import type { Suit } from '../games/registry'
import { SuitIcon } from './Suit'

interface Props {
  suit: Suit
  index?: string
  /** Qué tipo de carta es ("Votación", "Suave"…). Va al pie de la carta. */
  kind?: string
  children: ReactNode
  /** Cambiar este valor dispara la animación de "repartir". */
  dealKey?: string | number
  colorOverride?: string
  /** Dibujo de la esquina cuando no es un palo español (mazo francés). */
  cornerIcon?: ReactNode
}

export function Naipe({ suit, index, kind, children, dealKey, colorOverride, cornerIcon }: Props) {
  const style = { ['--suit' as string]: colorOverride ?? (suit === 'oros' ? 'var(--oros-ink)' : `var(--${suit})`) }
  const icon = cornerIcon ?? <SuitIcon suit={suit} />
  return (
    <article className="naipe is-entering" key={dealKey} style={style}>
      <div className="corner tl">
        {index && <span className="idx">{index}</span>}
        {icon}
      </div>
      <div className="corner br" aria-hidden="true">
        {index && <span className="idx">{index}</span>}
        {icon}
      </div>
      <div className="naipe-body">{children}</div>
      {kind && <div className="kind">{kind}</div>}
    </article>
  )
}

/** Achica la letra cuando el texto es largo. */
export function promptClass(text: string) {
  return text.length > 110 ? 'prompt long' : 'prompt'
}
