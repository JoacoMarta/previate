import { useState } from 'react'
import { IconWarn } from '../components/Icons'
import { Actions, TopBar } from '../components/Layout'
import { SuitIcon } from '../components/Suit'
import { gameById } from '../games/registry'
import { DECK_LABEL, type DeckKind } from '../lib/deck'
import { go } from '../lib/router'
import { loadSetup, saveSetup, type GameSetup } from '../lib/setup'
import { fill, useStore } from '../lib/store'
import { LEVELS, type Level } from '../lib/types'

export function GameDetail({ id }: { id: string }) {
  const game = gameById(id)
  const { players, drinks } = useStore()
  const [setup, setSetup] = useState<GameSetup>(() => loadSetup(id, { levels: ['suave'], deck: game?.decks?.[0] }))

  if (!game) return <NotFound />

  const update = (s: GameSetup) => {
    setSetup(s)
    saveSetup(id, s)
  }
  const toggleLevel = (l: Level) => {
    const has = setup.levels.includes(l)
    const levels = has ? setup.levels.filter((x) => x !== l) : [...setup.levels, l]
    if (levels.length) update({ ...setup, levels })
  }

  const missing = game.minPlayers - players.length
  const style = { ['--accent' as string]: `var(--${game.suit})`, ['--accent-ink' as string]: game.suit === 'copas' || game.suit === 'espadas' ? '#fff' : 'var(--ink)' }

  return (
    <div style={style} className="app-inner">
      <TopBar />
      <div className="page">
        <div className="detail-hero">
          <SuitIcon suit={game.suit} className="suit-mark" />
          <h2>{game.name}</h2>
          {game.aka && <p className="aka">También: {game.aka}</p>}
          <p className="lede">{game.short}</p>
        </div>
        <div className="needs"><span>Necesitan:</span><strong>{game.needs}</strong></div>

        {game.unconfirmed && (
          <aside className="unconfirmed" aria-label="Reglas sin confirmar">
            <h3><IconWarn />Reglas sin confirmar</h3>
            <p>{game.unconfirmed}</p>
            <p>{game.edit ? 'Si lo juegan distinto, cambialas en el editor.' : 'Si lo juegan distinto, sigan su versión: la app es una guía.'}</p>
          </aside>
        )}

        {game.rules.length > 0 && (
          <div className="block">
            <h3>Cómo se juega</h3>
            <ol className="steps">
              {game.rules.map((r) => <li key={r}>{fill(r, [], drinks)}</li>)}
            </ol>
          </div>
        )}

        {game.levels && (
          <div className="block">
            <h3>Nivel</h3>
            <div className="chips">
              {LEVELS.map((l) => (
                <button key={l.id} className="chip" aria-pressed={setup.levels.includes(l.id)} onClick={() => toggleLevel(l.id)}>
                  {l.label}
                </button>
              ))}
            </div>
            <p className="hint">Podés mezclar varios. Lo picante y lo hot son siempre preguntas para responder o señalar.</p>
          </div>
        )}

        {game.decks && game.decks.length > 1 && (
          <div className="block">
            <h3>Mazo</h3>
            <div className="chips">
              {game.decks.map((d: DeckKind) => (
                <button key={d} className="chip" aria-pressed={setup.deck === d} onClick={() => update({ ...setup, deck: d })}>
                  {DECK_LABEL[d]}
                </button>
              ))}
            </div>
          </div>
        )}

        {game.edit && (
          <button className="btn-text" style={{ alignSelf: 'flex-start' }} onClick={() => go('editar/' + game.id)}>
            Editar {game.edit.label.toLowerCase()}
          </button>
        )}

      </div>
      <Actions>
          {missing > 0 ? (
            <button className="btn" onClick={() => go('jugadores')}>
              {players.length === 0 ? `Cargá al menos ${game.minPlayers} jugadores` : `Faltan ${missing} ${missing === 1 ? 'jugador' : 'jugadores'}`}
            </button>
          ) : (
            <button className="btn" onClick={() => go('jugar/' + game.id)}>Jugar</button>
          )}
      </Actions>
    </div>
  )
}

export function NotFound() {
  return (
    <>
      <TopBar title="No está" onBack={() => go('')} />
      <div className="page"><p className="empty">Ese juego no existe. Volvé al inicio y elegí otro.</p></div>
    </>
  )
}
