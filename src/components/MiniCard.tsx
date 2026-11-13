import { isRed, valueIndex, valueName, type Card } from '../lib/deck'
import { CardSuit } from './CardSuit'

export function MiniCard({ card, faceUp = true, current, size }: { card?: Card; faceUp?: boolean; current?: boolean; size?: 'big' }) {
  const cls = 'mini-card' + (size === 'big' ? ' big' : '') + (current ? ' current' : '')
  if (!card || !faceUp) return <div className={cls} aria-label="Carta boca abajo" />
  return (
    <div className={cls + ' up' + (isRed(card) ? ' red' : '')} aria-label={valueName(card.value, card.deck)}>
      <span>{valueIndex(card.value, card.deck)}</span>
      <CardSuit card={card} />
    </div>
  )
}
