import { useState } from 'react'
import { FrenchSuitIcon } from '../components/FrenchSuit'
import { Actions, TopBar } from '../components/Layout'
import { MiniCard } from '../components/MiniCard'
import { buildDeck, isRed, valueName, type Card, type FrenchSuit } from '../lib/deck'
import { useStore } from '../lib/store'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

const QUESTIONS = ['¿Rojo o negro?', '¿Mayor o menor que la primera?', '¿Adentro o afuera de las dos primeras?', '¿De qué palo?']
const SUITS: { id: FrenchSuit; label: string }[] = [
  { id: 'corazones', label: 'Corazones' },
  { id: 'diamantes', label: 'Diamantes' },
  { id: 'treboles', label: 'Tréboles' },
  { id: 'picas', label: 'Picas' },
]

export function RojoONegro({ game }: { game: GameMeta }) {
  useWakeLock()
  const { players, drinks } = useStore()
  const [deck, setDeck] = useState<Card[]>(() => buildDeck('francesa'))
  const [turn, setTurn] = useState(0)
  const [hand, setHand] = useState<Card[]>([])
  const [result, setResult] = useState<boolean | null>(null)

  const stage = hand.length - (result === null ? 0 : 1)
  const who = players[turn % players.length]

  const answer = (check: (c: Card, h: Card[]) => boolean) => {
    let d = deck
    if (d.length === 0) d = buildDeck('francesa')
    const [c, ...rest] = d
    setDeck(rest)
    setResult(check(c, hand))
    setHand([...hand, c])
  }
  const between = (c: Card, h: Card[]) => {
    const lo = Math.min(h[0].value, h[1].value), hi = Math.max(h[0].value, h[1].value)
    return { inside: c.value > lo && c.value < hi, outside: c.value < lo || c.value > hi }
  }
  const next = () => {
    if (hand.length >= 4) {
      setHand([])
      setTurn(turn + 1)
    }
    setResult(null)
  }
  const n = stage + 1
  const last = hand[hand.length - 1]

  return (
    <div className="app-inner" style={{ ['--accent' as string]: 'var(--copas)', ['--accent-ink' as string]: '#fff' }}>
      <TopBar title={game.name} close />
      <div className="table" style={{ justifyContent: 'flex-start' }}>
        <div className="table-meta"><span>Le toca a <strong>{who}</strong></span><span>Pregunta {Math.min(n, 4)} de 4</span></div>
        <div className="hand hand-row">
          {[0, 1, 2, 3].map((i) => <MiniCard key={i} card={hand[i]} faceUp={!!hand[i]} current={i === hand.length - 1 && result !== null} size="big" />)}
        </div>
        {result === null ? (
          <div className="block">
            <h3 className="question">{QUESTIONS[stage]}</h3>
            <p className="hint" style={{ marginTop: 0 }}>Si acertás, repartís {drinks(n)}. Si errás, los tomás. El As vale 1.</p>
          </div>
        ) : (
          <div className={'verdict ' + (result ? 'ok' : 'bad')} role="status">
            <p className="rule-title">{result ? 'Acertaste' : 'Erraste'}</p>
            <p className="rule-text">Salió {valueName(last.value, last.deck)}. {result ? `Repartís ${drinks(n)}.` : `Tomás ${drinks(n)}.`}</p>
          </div>
        )}
      </div>
      <Actions>
        {result !== null ? (
          <button className="btn" onClick={next}>{hand.length >= 4 ? `Le toca a ${players[(turn + 1) % players.length]}` : 'Siguiente pregunta'}</button>
        ) : stage === 0 ? (
          <>
            <button className="btn" onClick={() => answer((c) => isRed(c))}>Rojo</button>
            <button className="btn" style={{ background: 'var(--card)', color: 'var(--ink)' }} onClick={() => answer((c) => !isRed(c))}>Negro</button>
          </>
        ) : stage === 1 ? (
          <>
            <button className="btn" onClick={() => answer((c, h) => c.value > h[0].value)}>Mayor</button>
            <button className="btn" onClick={() => answer((c, h) => c.value < h[0].value)}>Menor</button>
          </>
        ) : stage === 2 ? (
          <>
            <button className="btn" onClick={() => answer((c, h) => between(c, h).inside)}>Adentro</button>
            <button className="btn" onClick={() => answer((c, h) => between(c, h).outside)}>Afuera</button>
          </>
        ) : (
          <div className="suit-picker">
            {SUITS.map((s) => (
              <button key={s.id} className="btn btn-ghost suit-btn" onClick={() => answer((c) => c.suit === s.id)} aria-label={s.label}>
                <FrenchSuitIcon suit={s.id} />
              </button>
            ))}
          </div>
        )}
      </Actions>
    </div>
  )
}
