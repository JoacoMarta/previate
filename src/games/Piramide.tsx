import { useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { Naipe } from '../components/Naipe'
import { PassPhone } from '../components/PassPhone'
import { PlayerPicker } from '../components/PlayerPicker'
import { SuitIcon } from '../components/Suit'
import { buildDeck, frenchGlyph, isRed, spanishSuit, valueIndex, valueName, type Card, type DeckKind } from '../lib/deck'
import { useStore } from '../lib/store'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

type Phase = 'deal' | 'pyramid' | 'memory' | 'end'
type Challenge = null | { stage: 'pick' } | { stage: 'result'; claimer: string; had: boolean; replaced: boolean } | { stage: 'newcard'; claimer: string }

// Filas de abajo (vale 1) hacia arriba (vale 5).
const ROWS = [[0, 1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11], [12, 13], [14]]
const rowOf = (i: number) => ROWS.findIndex((r) => r.includes(i))

function MiniCard({ card, faceUp, current }: { card?: Card; faceUp: boolean; current?: boolean }) {
  if (!card || !faceUp) return <div className={'mini-card' + (current ? ' current' : '')} aria-label="Carta boca abajo" />
  const sp = spanishSuit(card)
  const glyph = frenchGlyph(card)
  return (
    <div className={'mini-card up' + (isRed(card) ? ' red' : '') + (current ? ' current' : '')} aria-label={valueName(card.value, card.deck)}>
      <span>{valueIndex(card.value, card.deck)}</span>
      {sp ? <SuitIcon suit={sp} /> : <span style={{ fontSize: 18 }}>{glyph}</span>}
    </div>
  )
}

function deal(players: string[], kind: DeckKind) {
  const deck = buildDeck(kind)
  const per = [4, 3, 2].find((k) => players.length * k + 15 <= deck.length) ?? 1
  const hands: Record<string, Card[]> = {}
  let p = 0
  for (const name of players) {
    hands[name] = deck.slice(p, p + per)
    p += per
  }
  const pyramid = deck.slice(p, p + 15)
  return { hands, pyramid, rest: deck.slice(p + 15), per }
}

export function Piramide({ game, deckKind }: { game: GameMeta; deckKind: DeckKind }) {
  useWakeLock()
  const { players, drinks } = useStore()
  const [g, setG] = useState(() => deal(players, deckKind))
  const [phase, setPhase] = useState<Phase>('deal')
  const [turn, setTurn] = useState(0)
  const [flipped, setFlipped] = useState(0)
  const [challenge, setChallenge] = useState<Challenge>(null)
  const [shownHand, setShownHand] = useState(false)

  const style = { ['--accent' as string]: 'var(--copas)', ['--accent-ink' as string]: '#fff' }
  const restart = () => {
    setG(deal(players, deckKind))
    setPhase('deal')
    setTurn(0)
    setFlipped(0)
    setChallenge(null)
    setShownHand(false)
  }

  if (phase === 'deal') {
    const name = players[turn]
    const last = turn === players.length - 1
    return (
      <div className="app-inner" style={style}>
        <TopBar title={game.name} close />
        <PassPhone
          key={name}
          name={name}
          note={`Vas a ver tus ${g.per} cartas. Memorizalas: después no las vas a poder volver a mirar.`}
          doneLabel={last ? 'Ya me las acordé, armar la pirámide' : 'Ya me las acordé, ocultar'}
          onDone={() => (last ? setPhase('pyramid') : setTurn(turn + 1))}
        >
          <div className="block">
            <h3>Tus cartas, {name}</h3>
            <div className="hand">
              {g.hands[name].map((c) => <MiniCard key={c.id} card={c} faceUp />)}
            </div>
            <p className="hint">Lo que importa es el número, no el palo.</p>
          </div>
        </PassPhone>
      </div>
    )
  }

  const pyramidView = (
    <div className="pyramid" aria-label="Pirámide">
      {[...ROWS].reverse().map((row) => {
        const worth = rowOf(row[0]) + 1
        return (
          <div className="pyr-row" key={row[0]}>
            <span className="worth">{worth}</span>
            {row.map((i) => <MiniCard key={i} card={g.pyramid[i]} faceUp={i < flipped} current={phase === 'pyramid' && i === flipped - 1} />)}
            <span className="worth worth-r" />
          </div>
        )
      })}
    </div>
  )

  if (phase === 'pyramid') {
    const cur = flipped > 0 ? g.pyramid[flipped - 1] : null
    const worth = cur ? rowOf(flipped - 1) + 1 : 0
    const done = flipped >= 15

    if (challenge?.stage === 'newcard') {
      const claimer = challenge.claimer
      return (
        <div className="app-inner" style={style}>
          <TopBar title={game.name} close />
          <PassPhone key={'nc' + claimer} name={claimer} note="Te toca una carta nueva en lugar de la que mostraste." onDone={() => setChallenge(null)}>
            <div className="block">
              <h3>Tus cartas ahora</h3>
              <div className="hand">{g.hands[claimer].map((c) => <MiniCard key={c.id} card={c} faceUp />)}</div>
              <p className="hint">Memorizalas de nuevo.</p>
            </div>
          </PassPhone>
        </div>
      )
    }

    const verify = (claimer: string) => {
      if (!cur) return
      const hand = g.hands[claimer]
      const idx = hand.findIndex((c) => c.value === cur.value)
      if (idx === -1) {
        setChallenge({ stage: 'result', claimer, had: false, replaced: false })
        return
      }
      const rest = [...g.rest]
      const replacement = rest.shift()
      const newHand = [...hand]
      if (replacement) newHand[idx] = replacement
      else newHand.splice(idx, 1)
      setG({ ...g, rest, hands: { ...g.hands, [claimer]: newHand } })
      setChallenge({ stage: 'result', claimer, had: true, replaced: !!replacement })
    }

    return (
      <div className="app-inner" style={style}>
        <TopBar title={game.name} close />
        {pyramidView}
        <div className="table" style={{ justifyContent: 'flex-start', gap: 12 }}>
          {!cur && <p className="hint" style={{ margin: 0 }}>Den vuelta la primera carta de abajo. Esa fila vale {drinks(1)}.</p>}
          {cur && !challenge && (
            <div className="block">
              <h3>Salió un {valueName(cur.value, cur.deck)}. Esta fila vale {drinks(worth)}.</h3>
              <p className="hint" style={{ marginTop: 0 }}>
                El que tenga un {valueName(cur.value, cur.deck)} (o diga que tiene) le manda {drinks(worth)} a alguien. Si alguien no le cree, toquen “No le creo”.
              </p>
            </div>
          )}
          {challenge?.stage === 'pick' && (
            <PlayerPicker players={players} label="¿Quién dijo que tenía la carta?" onPick={verify} />
          )}
          {challenge?.stage === 'result' && cur && (
            <Naipe suit="copas" dealKey={'r' + flipped + challenge.claimer} colorOverride={challenge.had ? 'var(--bastos)' : 'var(--copas)'}>
              <p className="rule-title">{challenge.had ? 'Era verdad' : 'Mintió'}</p>
              <p className="rule-text">
                {challenge.had
                  ? `${challenge.claimer} tenía un ${valueName(cur.value, cur.deck)}. El que no le creyó toma ${drinks(worth * 2)}.`
                  : `${challenge.claimer} no tenía ningún ${valueName(cur.value, cur.deck)}. Toma ${drinks(worth * 2)}.`}
              </p>
              {challenge.had && (
                <p className="sub">{challenge.replaced ? 'Esa carta se cambia por una nueva.' : 'No quedan cartas para reponer: se queda con una menos.'}</p>
              )}
            </Naipe>
          )}
        </div>
        <Actions>
          {challenge?.stage === 'pick' ? (
            <button className="btn btn-ghost" onClick={() => setChallenge(null)}>Cancelar</button>
          ) : challenge?.stage === 'result' ? (
            <button className="btn" onClick={() => setChallenge(challenge.had && challenge.replaced ? { stage: 'newcard', claimer: challenge.claimer } : null)}>
              {challenge.had && challenge.replaced ? `Ver carta nueva de ${challenge.claimer}` : 'Seguir'}
            </button>
          ) : (
            <>
              {cur && <button className="btn btn-ghost" style={{ flex: '0 0 auto' }} onClick={() => setChallenge({ stage: 'pick' })}>No le creo</button>}
              {done ? (
                <button className="btn" onClick={() => { setPhase('memory'); setTurn(0); setShownHand(false) }}>Prueba de memoria</button>
              ) : (
                <button className="btn" onClick={() => setFlipped(flipped + 1)}>Dar vuelta</button>
              )}
            </>
          )}
        </Actions>
      </div>
    )
  }

  if (phase === 'memory') {
    const name = players[turn]
    const last = turn === players.length - 1
    return (
      <div className="app-inner" style={style}>
        <TopBar title={game.name} close />
        <div className="pass">
          <p className="to">Prueba de memoria</p>
          <p className="who">{name}</p>
          <p className="note">Decí tus cartas en voz alta. Después mostralas: por cada una que erraste, tomá {drinks(1)}.</p>
          {shownHand && (
            <div className="hand" style={{ marginTop: 10 }}>
              {g.hands[name].map((c) => <MiniCard key={c.id} card={c} faceUp />)}
            </div>
          )}
        </div>
        <Actions>
          {!shownHand ? (
            <button className="btn" onClick={() => setShownHand(true)}>Mostrar las cartas de {name}</button>
          ) : (
            <button className="btn" onClick={() => { if (last) setPhase('end'); else { setTurn(turn + 1); setShownHand(false) } }}>
              {last ? 'Terminar' : `Sigue ${players[turn + 1]}`}
            </button>
          )}
        </Actions>
      </div>
    )
  }

  return (
    <div className="app-inner" style={style}>
      <TopBar title={game.name} close />
      <div className="table">
        <Naipe suit="copas" dealKey="fin">
          <p className="prompt">Terminó la pirámide.</p>
          <p className="sub">Repartan de nuevo para otra vuelta.</p>
        </Naipe>
      </div>
      <Actions>
        <button className="btn" onClick={restart}>Repartir de nuevo</button>
      </Actions>
    </div>
  )
}
