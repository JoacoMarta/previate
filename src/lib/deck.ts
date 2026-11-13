import { shuffle } from './random'

export type DeckKind = 'espanola40' | 'espanola48' | 'francesa'
export type SpanishSuit = 'oros' | 'copas' | 'espadas' | 'bastos'
export type FrenchSuit = 'corazones' | 'diamantes' | 'treboles' | 'picas'

export interface Card {
  id: string
  value: number // 1..12 en la española, 1..13 en la francesa
  suit: SpanishSuit | FrenchSuit
  deck: DeckKind
}

export const DECK_LABEL: Record<DeckKind, string> = {
  espanola40: 'Española de 40 (sin 8 ni 9)',
  espanola48: 'Española de 48',
  francesa: 'Francesa / póker (52)',
}

export function deckValues(kind: DeckKind): number[] {
  if (kind === 'espanola40') return [1, 2, 3, 4, 5, 6, 7, 10, 11, 12]
  if (kind === 'espanola48') return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
}

export function buildDeck(kind: DeckKind): Card[] {
  const suits: (SpanishSuit | FrenchSuit)[] =
    kind === 'francesa' ? ['corazones', 'diamantes', 'treboles', 'picas'] : ['oros', 'copas', 'espadas', 'bastos']
  const cards: Card[] = []
  for (const suit of suits) for (const value of deckValues(kind)) cards.push({ id: `${suit}-${value}`, value, suit, deck: kind })
  return shuffle(cards)
}

export function valueName(value: number, kind: DeckKind): string {
  if (kind === 'francesa') {
    return ({ 1: 'As', 11: 'J', 12: 'Q', 13: 'K' } as Record<number, string>)[value] ?? String(value)
  }
  return ({ 1: 'As', 10: 'Sota', 11: 'Caballo', 12: 'Rey' } as Record<number, string>)[value] ?? String(value)
}

/** Lo que va en la esquina de la carta. */
export function valueIndex(value: number, kind: DeckKind): string {
  if (kind === 'francesa') return ({ 1: 'A', 11: 'J', 12: 'Q', 13: 'K' } as Record<number, string>)[value] ?? String(value)
  return String(value)
}

const SUIT_NAME: Record<string, string> = {
  oros: 'oros', copas: 'copas', espadas: 'espadas', bastos: 'bastos',
  corazones: 'corazones', diamantes: 'diamantes', treboles: 'tréboles', picas: 'picas',
}

export function cardName(card: Card): string {
  return `${valueName(card.value, card.deck)} de ${SUIT_NAME[card.suit]}`
}

/** Valor que cuenta como "rey" (el último de cada palo). */
export function kingValue(kind: DeckKind) {
  return kind === 'francesa' ? 13 : 12
}


export function isRed(card: Card) {
  return card.suit === 'corazones' || card.suit === 'diamantes'
}

const SPANISH_SUITS = ['oros', 'copas', 'espadas', 'bastos']
export function spanishSuit(card: Card): 'oros' | 'copas' | 'espadas' | 'bastos' | undefined {
  return SPANISH_SUITS.includes(card.suit) ? (card.suit as 'oros' | 'copas' | 'espadas' | 'bastos') : undefined
}
