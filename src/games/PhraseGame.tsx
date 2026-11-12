import { useMemo, useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { Naipe, promptClass } from '../components/Naipe'
import { shuffle } from '../lib/random'
import { fill, useStore } from '../lib/store'
import { LEVELS, type Level, type Phrase } from '../lib/types'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

const LEVEL_COLOR: Record<Level, string> = { suave: 'var(--oros-ink)', picante: 'var(--copas)', hot: '#b3245e' }

export function PhraseGame({ game, listId, defaults, levels, render, reminder }: {
  game: GameMeta
  listId: string
  defaults: Phrase[]
  levels: Level[]
  render: (text: string) => string
  reminder: string
}) {
  useWakeLock()
  const store = useStore()
  const pool = useMemo(
    () => store.getList(listId, defaults).filter((p) => levels.includes(p.level)),
    // la lista se arma una vez por partida
    [],
  )
  const [deck, setDeck] = useState(() => shuffle(pool))
  const [i, setI] = useState(0)

  const reader = store.players.length ? store.players[i % store.players.length] : null
  const card = deck[i]
  const done = i >= deck.length

  return (
    <div className="app-inner" style={{ ['--accent' as string]: 'var(--oros)' }}>
      <TopBar title={game.name} close />
      <div className="table">
        {deck.length === 0 ? (
          <p className="empty">No hay frases para los niveles que elegiste. Volvé y sumá otro nivel.</p>
        ) : done ? (
          <Naipe suit="oros" dealKey="fin">
            <p className="prompt">Se terminaron las frases.</p>
            <p className="sub">Pueden mezclar y arrancar de nuevo, o agregar las suyas en Editar.</p>
          </Naipe>
        ) : (
          <>
            <div className="table-meta">
              <span>{reader ? <>Lee <strong>{reader}</strong></> : 'Lee alguien en voz alta'}</span>
              <span>{i + 1} de {deck.length}</span>
            </div>
            <Naipe
              suit="oros"
              index={String(i + 1)}
              kind={LEVELS.find((l) => l.id === card.level)?.label}
              dealKey={card.id + i}
              colorOverride={LEVEL_COLOR[card.level]}
            >
              <p className={promptClass(card.text)}>{render(card.text)}</p>
              <p className="sub">{fill(reminder, [], store.drinks)}</p>
            </Naipe>
          </>
        )}
      </div>
      <Actions>
        {done || deck.length === 0 ? (
          <button className="btn" onClick={() => { setDeck(shuffle(pool)); setI(0) }} disabled={!pool.length}>Mezclar de nuevo</button>
        ) : (
          <>
            {i > 0 && <button className="btn btn-ghost" style={{ flex: '0 0 auto' }} onClick={() => setI(i - 1)}>Anterior</button>}
            <button className="btn" onClick={() => setI(i + 1)}>Siguiente</button>
          </>
        )}
      </Actions>
    </div>
  )
}
