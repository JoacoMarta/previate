import { useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { Naipe, promptClass } from '../components/Naipe'
import { KIND_LABEL, MODO_PREVIA, type PreviaCard } from '../content/modoPrevia'
import { randInt, sample, shuffle } from '../lib/random'
import { fill, useStore } from '../lib/store'
import type { Level } from '../lib/types'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

const LEVEL_COLOR: Record<Level, string> = { suave: 'var(--oros-ink)', picante: 'var(--copas)', hot: '#b3245e' }

interface Shown {
  label: string
  text: string
  level: Level
  key: string
}

interface State {
  deck: PreviaCard[]
  pos: number
  step: number
  ends: { at: number; text: string; rule: string }[]
  active: string[]
  shown: Shown | null
  lastA: string | null
}

function needed(text: string) {
  return text.includes('{c}') ? 3 : text.includes('{b}') ? 2 : text.includes('{a}') ? 1 : 0
}

export function ModoPrevia({ game, levels }: { game: GameMeta; levels: Level[] }) {
  useWakeLock()
  const store = useStore()
  const { players, drinks } = store

  const build = (): PreviaCard[] => {
    const custom: PreviaCard[] = store.customOf('modo-previa').map((p) => ({ ...p, kind: 'custom' as const }))
    const all = [...store.getList('modo-previa', MODO_PREVIA).filter((p) => !p.custom) as PreviaCard[], ...custom]
    return shuffle(all.filter((c) => levels.includes(c.level) && needed(c.text) <= players.length))
  }

  const advance = (s: State): State => {
    const step = s.step + 1
    const due = s.ends.find((e) => e.at <= step)
    if (due) {
      return {
        ...s,
        step,
        ends: s.ends.filter((e) => e !== due),
        active: s.active.filter((r) => r !== due.rule),
        shown: { label: 'Fin de la regla', text: due.text, level: 'suave', key: 'end' + step },
      }
    }
    if (s.pos >= s.deck.length) {
      // se terminó el mazo: cerramos las reglas que quedaban
      return { ...s, step, ends: [], active: [], shown: null }
    }
    const card = s.deck[s.pos]
    let names = sample(players, 3)
    for (let t = 0; t < 3 && names[0] === s.lastA && players.length > 1; t++) names = sample(players, 3)
    const text = fill(card.text, names, drinks)
    const next: State = {
      ...s,
      step,
      pos: s.pos + 1,
      lastA: card.text.includes('{a}') ? names[0] : s.lastA,
      shown: { label: KIND_LABEL[card.kind], text, level: card.level, key: card.id + step },
    }
    if (card.kind === 'regla' && card.end) {
      next.ends = [...s.ends, { at: step + randInt(4, 8), text: fill(card.end, names, drinks), rule: text }]
      next.active = [...s.active, text]
    }
    return next
  }

  const [state, setState] = useState<State>(() =>
    advance({ deck: build(), pos: 0, step: 0, ends: [], active: [], shown: null, lastA: null }),
  )

  const restart = () => setState(advance({ deck: build(), pos: 0, step: 0, ends: [], active: [], shown: null, lastA: null }))
  const { shown, active } = state

  return (
    <div className="app-inner" style={{ ['--accent' as string]: 'var(--oros)' }}>
      <TopBar title={game.name} close />
      {active.length > 0 && shown?.label !== 'Regla nueva' && (
        <div className="rules-active">
          <p>{active.length === 1 ? 'Regla activa' : 'Reglas activas'}</p>
          <ul>{active.map((r) => <li key={r}>{r.replace(/^Regla: /, '')}</li>)}</ul>
        </div>
      )}
      <div className="table">
        {shown ? (
          <Naipe suit="oros" index={String(state.step)} kind={shown.label} dealKey={shown.key} colorOverride={LEVEL_COLOR[shown.level]}>
            <p className={promptClass(shown.text)}>{shown.text}</p>
          </Naipe>
        ) : (
          <Naipe suit="oros" dealKey="fin">
            <p className="prompt">Se terminaron las cartas.</p>
            <p className="sub">Mezclen y arranquen de nuevo, o sumen cartas propias en Editar.</p>
          </Naipe>
        )}
      </div>
      <Actions>
        {shown ? (
          <button className="btn" onClick={() => setState(advance)}>Siguiente</button>
        ) : (
          <button className="btn" onClick={restart}>Mezclar de nuevo</button>
        )}
      </Actions>
    </div>
  )
}
