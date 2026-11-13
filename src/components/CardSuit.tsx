import type { Card, FrenchSuit } from '../lib/deck'
import { spanishSuit } from '../lib/deck'
import { FrenchSuitIcon } from './FrenchSuit'
import { SuitIcon } from './Suit'

/** El dibujo del palo de una carta, sea del mazo español o del francés. */
export function CardSuit({ card, className }: { card: Card; className?: string }) {
  const sp = spanishSuit(card)
  return sp ? <SuitIcon suit={sp} className={className} /> : <FrenchSuitIcon suit={card.suit as FrenchSuit} className={className} />
}
