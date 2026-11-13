import { useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { MiniCard } from '../components/MiniCard'
import { buildDeck, type Card } from '../lib/deck'
import { useStore } from '../lib/store'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

const worth = (c: Card) => (c.value >= 10 ? 0.5 : c.value)
const total = (h: Card[]) => h.reduce((s, c) => s + worth(c), 0)
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : `${Math.floor(n)} y medio`)

export function SieteYMedio({ game }: { game: GameMeta }) {
  useWakeLock()
  const { players, drinks } = useStore()
  const [deck, setDeck] = useState<Card[]>(() => buildDeck('espanola40'))
  const [turn, setTurn] = useState(0)
  const [hand, setHand] = useState<Card[]>([])
  const [scores, setScores] = useState<Record<string, number>>({})
  const [phase, setPhase] = useState<'play' | 'bust' | 'end'>('play')

  const who = players[turn]
  const t = total(hand)

  const draw = () => {
    let d = deck
    if (d.length === 0) d = buildDeck('espanola40')
    const [c, ...rest] = d
    setDeck(rest)
    const h = [...hand, c]
    setHand(h)
    if (total(h) > 7.5) setPhase('bust')
  }
  const stand = (score: number) => {
    const s = { ...scores, [who]: score }
    setScores(s)
    setHand([])
    if (turn + 1 >= players.length) setPhase('end')
    else { setTurn(turn + 1); setPhase('play') }
  }
  const restart = () => { setScores({}); setTurn(0); setHand([]); setPhase('play'); setDeck(buildDeck('espanola40')) }

  if (phase === 'end') {
    const valid = Object.entries(scores).filter(([, s]) => s <= 7.5)
    const exact = valid.filter(([, s]) => s === 7.5).map(([p]) => p)
    const min = valid.length ? Math.min(...valid.map(([, s]) => s)) : null
    const far = min === null ? [] : valid.filter(([, s]) => s === min && s !== 7.5).map(([p]) => p)
    return (
      <div className="app-inner" style={{ ['--accent' as string]: 'var(--copas)', ['--accent-ink' as string]: '#fff' }}>
        <TopBar title={game.name} close />
        <div className="page page-tight">
          <div className="verdict" role="status">
            <p className="rule-title">Resultado</p>
            {exact.length > 0 && <p className="rule-text">{exact.join(', ')} {exact.length > 1 ? 'llegaron' : 'llegó'} a siete y medio: {exact.length > 1 ? 'reparten' : 'reparte'} {drinks(4)}.</p>}
            {far.length > 0 && <p className="rule-text">{far.join(', ')} {far.length > 1 ? 'quedaron' : 'quedó'} más lejos: {far.length > 1 ? 'toman' : 'toma'} {drinks(2)}.</p>}
            {valid.length === 0 && <p className="rule-text">Se pasaron todos. Ya tomaron.</p>}
          </div>
          <ul className="score-list">
            {players.map((p) => (
              <li key={p}><span>{p}</span><strong>{scores[p] > 7.5 ? 'Se pasó' : fmt(scores[p] ?? 0)}</strong></li>
            ))}
          </ul>
        </div>
        <Actions><button className="btn" onClick={restart}>Otra mano</button></Actions>
      </div>
    )
  }

  return (
    <div className="app-inner" style={{ ['--accent' as string]: 'var(--copas)', ['--accent-ink' as string]: '#fff' }}>
      <TopBar title={game.name} close />
      <div className="table" style={{ justifyContent: 'flex-start' }}>
        <div className="table-meta"><span>Juega <strong>{who}</strong></span><span>{turn + 1} de {players.length}</span></div>
        <div className="hand hand-row">
          {hand.length === 0 ? <MiniCard faceUp={false} size="big" /> : hand.map((c) => <MiniCard key={c.id} card={c} size="big" />)}
        </div>
        <p className="big-total" aria-live="polite">{hand.length ? fmt(t) : 'Pedí la primera'}</p>
        {phase === 'bust' && (
          <div className="verdict bad" role="status">
            <p className="rule-title">Te pasaste</p>
            <p className="rule-text">{who} toma {drinks(2)}.</p>
          </div>
        )}
      </div>
      <Actions>
        {phase === 'bust' ? (
          <button className="btn" onClick={() => stand(t)}>{turn + 1 >= players.length ? 'Ver resultado' : `Le toca a ${players[turn + 1]}`}</button>
        ) : (
          <>
            {hand.length > 0 && <button className="btn btn-ghost" onClick={() => stand(t)}>Plantarme</button>}
            <button className="btn" onClick={draw}>Pedir carta</button>
          </>
        )}
      </Actions>
    </div>
  )
}
