import { useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { MiniCard } from '../components/MiniCard'
import { buildDeck, valueIndex, valueName, type Card } from '../lib/deck'
import { useStore } from '../lib/store'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

interface Outcome { text: string; card: Card }

export function FuckTheDealer({ game }: { game: GameMeta }) {
  useWakeLock()
  const { players, drinks } = useStore()
  const [deck, setDeck] = useState<Card[]>(() => buildDeck('francesa'))
  const [seen, setSeen] = useState<Record<number, number>>({})
  const [dealer, setDealer] = useState(0)
  const [guesser, setGuesser] = useState(1 % players.length)
  const [misses, setMisses] = useState(0)
  const [first, setFirst] = useState<number | null>(null)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [note, setNote] = useState('')

  const card = deck[0]
  const dName = players[dealer]
  const gName = players[guesser]
  const nextIdx = (i: number, skip: number) => {
    let n = (i + 1) % players.length
    if (n === skip) n = (n + 1) % players.length
    return n
  }

  const finish = (text: string, missed: boolean) => {
    setOutcome({ text, card })
    setSeen((s) => ({ ...s, [card.value]: (s[card.value] ?? 0) + 1 }))
    const m = missed ? misses + 1 : 0
    if (m >= 3) {
      const nd = (dealer + 1) % players.length
      setNote(`Tres seguidos erraron: ${dName} zafa y ahora reparte ${players[nd]}.`)
      setDealer(nd)
      setMisses(0)
      setGuesser(nextIdx(nd, nd))
    } else {
      setNote('')
      setMisses(m)
      setGuesser(nextIdx(guesser, dealer))
    }
  }

  const guess = (v: number) => {
    if (first === null) {
      if (v === card.value) finish(`¡Acertó a la primera! ${dName} toma ${drinks(4)}.`, false)
      else setFirst(v)
      return
    }
    if (v === card.value) finish(`Acertó en el segundo intento. ${dName} toma ${drinks(2)}.`, false)
    else finish(`Erró los dos. ${gName} toma ${drinks(Math.abs(v - card.value))}.`, true)
  }

  const next = () => {
    const rest = deck.slice(1)
    if (rest.length === 0) {
      setDeck(buildDeck('francesa'))
      setSeen({})
    } else setDeck(rest)
    setFirst(null)
    setOutcome(null)
  }

  return (
    <div className="app-inner" style={{ ['--accent' as string]: 'var(--copas)', ['--accent-ink' as string]: '#fff' }}>
      <TopBar title={game.name} close />
      <div className="status-row">
        <span className="status">Dealer: <strong>{dName}</strong></span>
        <span className="status">Fallos <strong>{misses} de 3</strong></span>
        <span className="status">Quedan <strong>{deck.length}</strong></span>
      </div>
      <div className="table" style={{ justifyContent: 'flex-start' }}>
        {outcome ? (
          <>
            <div className="hand hand-row"><MiniCard card={outcome.card} size="big" /></div>
            <div className="verdict" role="status">
              <p className="rule-title">Era {valueName(outcome.card.value, outcome.card.deck)}</p>
              <p className="rule-text">{outcome.text}</p>
              {note && <p className="sub">{note}</p>}
            </div>
          </>
        ) : (
          <>
            <div className="table-meta">
              <span>Adivina <strong>{gName}</strong></span>
              <span>{first === null ? 'Primer intento' : 'Segundo intento'}</span>
            </div>
            {first !== null && (
              <p className="question">{card.value > first ? 'Es mayor' : 'Es menor'} que {valueIndex(first, 'francesa')}.</p>
            )}
            <div className="value-grid" role="group" aria-label="Elegí un número">
              {VALUES.map((v) => (
                <button key={v} className="value-btn" onClick={() => guess(v)} disabled={first === v}>
                  <span>{valueIndex(v, 'francesa')}</span>
                  <small>{4 - (seen[v] ?? 0)} quedan</small>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {outcome && (
        <Actions>
          <button className="btn" onClick={next}>Siguiente carta</button>
        </Actions>
      )}
    </div>
  )
}
