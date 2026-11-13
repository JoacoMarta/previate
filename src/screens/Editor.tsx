import { useState } from 'react'
import { IconEye, IconTrash } from '../components/Icons'
import { TopBar } from '../components/Layout'
import { ruleKey, rulesFor } from '../content/cardRules'
import { LIST_DEFAULTS } from '../content'
import { IMPOSTOR_CATS } from '../content/impostor'
import { MODO_PREVIA } from '../content/modoPrevia'
import { gameById, type EditList } from '../games/registry'
import { DECK_LABEL, deckValues, valueName, type DeckKind } from '../lib/deck'
import { useStore } from '../lib/store'
import { LEVELS, type Level, type Phrase } from '../lib/types'
import { NotFound } from './GameDetail'

export function Editor({ id }: { id: string }) {
  const game = gameById(id)
  if (!game?.edit) return <NotFound />
  const style = { ['--accent' as string]: `var(--${game.suit})`, ['--accent-ink' as string]: game.suit === 'copas' || game.suit === 'espadas' ? '#fff' : 'var(--ink)' }
  return (
    <div className="app-inner" style={style}>
      <TopBar title={`${game.edit.label}: ${game.name}`} />
      <div className="page page-tight">
        {game.edit.kind === 'lists' && game.edit.lists && <ListsEditor lists={game.edit.lists} />}
        {game.edit.kind === 'previa' && (
          <>
            <p className="hint" style={{ margin: 0 }}>
              En tus cartas podés usar <strong>{'{a}'}</strong> y <strong>{'{b}'}</strong> para nombres al azar, y <strong>{'{2}'}</strong> para decir “2 tragos”.
              Ej.: “{'{a}'}, contá tu peor viaje o tomá {'{2}'}.”
            </p>
            <ListEditor listId="modo-previa" defaults={MODO_PREVIA} levels />
          </>
        )}
        {game.edit.kind === 'impostor' && <ImpostorEditor />}
        {game.edit.kind === 'rules' && game.decks && <RulesEditor gameId={game.id} decks={game.decks} />}
      </div>
    </div>
  )
}

function ListsEditor({ lists }: { lists: EditList[] }) {
  const [active, setActive] = useState(lists[0].id)
  const current = lists.find((l) => l.id === active) ?? lists[0]
  return (
    <>
      {lists.length > 1 && (
        <div className="tabs" role="tablist">
          {lists.map((l) => (
            <button key={l.id} role="tab" className="chip" aria-selected={l.id === active} aria-pressed={l.id === active} onClick={() => setActive(l.id)}>{l.label}</button>
          ))}
        </div>
      )}
      {lists.length === 1 && current.label.includes('|') && <p className="hint" style={{ margin: 0 }}>{current.label}</p>}
      <ListEditor key={current.id} listId={current.id} defaults={LIST_DEFAULTS[current.id] ?? []} levels={current.levels} />
    </>
  )
}

function ListEditor({ listId, defaults, levels }: { listId: string; defaults: Phrase[]; levels: boolean }) {
  const store = useStore()
  const [text, setText] = useState('')
  const [level, setLevel] = useState<Level>('suave')
  const [filter, setFilter] = useState<Level | 'todas'>('todas')
  const custom = store.customOf(listId)
  const shownDefaults = defaults.filter((p) => filter === 'todas' || p.level === filter)
  const hiddenCount = defaults.filter((p) => store.isHidden(listId, p.id)).length

  const add = () => {
    const t = text.trim()
    if (!t) return
    store.addPhrase(listId, t, levels ? level : 'suave')
    setText('')
  }

  return (
    <>
      <form className="field" onSubmit={(e) => { e.preventDefault(); add() }}>
        <label htmlFor="nueva">Agregar una nueva</label>
        <textarea id="nueva" className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribila acá" />
        {levels && (
          <div className="chips">
            {LEVELS.map((l) => (
              <button type="button" key={l.id} className="chip" aria-pressed={level === l.id} onClick={() => setLevel(l.id)}>{l.label}</button>
            ))}
          </div>
        )}
        <button className="btn btn-small" type="submit" disabled={!text.trim()} style={{ alignSelf: 'flex-start' }}>Agregar</button>
      </form>

      <div>
        <div className="section-title"><h3>Tuyas</h3><span>{custom.length}</span></div>
        {custom.length === 0 ? (
          <p className="empty" style={{ paddingTop: 6 }}>Todavía no agregaste ninguna.</p>
        ) : (
          <ul className="phrase-list">
            {custom.map((p) => (
              <li key={p.id}>
                <span className="ptext">{p.text}{levels && <span className="lvl">{LEVELS.find((l) => l.id === p.level)?.label}</span>}</span>
                <button className="mini-btn" onClick={() => store.removeCustom(listId, p.id)} aria-label="Borrar"><IconTrash /></button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <div className="section-title">
          <h3>Las que vienen</h3>
          <span>{hiddenCount ? `${hiddenCount} ocultas` : `${defaults.length}`}</span>
        </div>
        <p className="hint" style={{ marginTop: 0 }}>Tocá el ojo para que una no salga más. Se puede volver a mostrar.</p>
        {levels && (
          <div className="chips" style={{ margin: '10px 0 4px' }}>
            {(['todas', ...LEVELS.map((l) => l.id)] as const).map((f) => (
              <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f === 'todas' ? 'Todas' : LEVELS.find((l) => l.id === f)?.label}
              </button>
            ))}
          </div>
        )}
        <ul className="phrase-list">
          {shownDefaults.map((p) => {
            const hidden = store.isHidden(listId, p.id)
            return (
              <li key={p.id} className={hidden ? 'is-hidden' : ''}>
                <span className="ptext">{p.text}</span>
                <button className="mini-btn" onClick={() => store.toggleHidden(listId, p.id)} aria-label={hidden ? 'Volver a mostrar' : 'Ocultar'}>
                  <IconEye off={hidden} />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

function ImpostorEditor() {
  const store = useStore()
  const cats = [...Object.keys(IMPOSTOR_CATS), ...store.impostorCats]
  const [cat, setCat] = useState(cats[0])
  const [newCat, setNewCat] = useState('')
  const isCustomCat = store.impostorCats.includes(cat)

  return (
    <>
      <div className="tabs" role="tablist">
        {cats.map((c) => (
          <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <form className="inline-form" onSubmit={(e) => {
        e.preventDefault()
        const n = newCat.trim()
        if (!n) return
        store.addImpostorCat(n)
        setCat(n)
        setNewCat('')
      }}>
        <input className="input" value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Nueva categoría (ej.: Nuestros amigos)" aria-label="Nueva categoría" />
        <button className="btn btn-small" type="submit" disabled={!newCat.trim()}>Crear</button>
      </form>
      {isCustomCat && (
        <button className="btn-text" style={{ alignSelf: 'flex-start', color: 'var(--copas)' }} onClick={() => { store.removeImpostorCat(cat); setCat(cats[0]) }}>
          Borrar la categoría {cat}
        </button>
      )}
      <ListEditor key={cat} listId={'impostor:' + cat} defaults={IMPOSTOR_CATS[cat] ?? []} levels={false} />
    </>
  )
}

const EFFECT_NOTE: Record<string, string> = {
  king: 'Además, la app cuenta los reyes y avisa en el cuarto.',
  puta: 'Además, la app te pide elegir a la puta y la muestra arriba.',
  companero: 'Además, la app te pide elegir al compañero y lo muestra arriba.',
  bano: 'Además, la app anota el pase al baño.',
  regla: 'Además, la app te deja anotar la regla.',
}

function RulesEditor({ gameId, decks }: { gameId: string; decks: DeckKind[] }) {
  const store = useStore()
  const [deck, setDeck] = useState<DeckKind>(decks[0])
  const base = rulesFor(gameId, deck)
  const overrides = store.rules[gameId] ?? {}

  return (
    <>
      {decks.length > 1 && (
        <div className="chips">
          {decks.map((d) => <button key={d} className="chip" aria-pressed={deck === d} onClick={() => setDeck(d)}>{DECK_LABEL[d]}</button>)}
        </div>
      )}
      <p className="hint" style={{ margin: 0 }}>Los cambios se guardan solos. Usá {'{2}'} para decir “2 tragos”.</p>
      <div>
        {deckValues(deck).map((v) => {
          const key = ruleKey(deck, v)
          const o = overrides[key]
          const r = base[v]
          const title = o?.title ?? r.title
          const text = o?.text ?? r.text
          const set = (patch: Partial<{ title: string; text: string }>) => store.setRule(gameId, key, { title, text, ...patch })
          return (
            <div className="rule-edit" key={key}>
              <div className="rule-head">
                <span className="v">{valueName(v, deck)}</span>
                <input className="input" value={title} onChange={(e) => set({ title: e.target.value })} aria-label={`Nombre de la regla del ${valueName(v, deck)}`} />
              </div>
              <textarea className="textarea" value={text} onChange={(e) => set({ text: e.target.value })} aria-label={`Qué hace el ${valueName(v, deck)}`} />
              {r.effect && <span className="effect">{EFFECT_NOTE[r.effect]}</span>}
              {o && (
                <button className="btn-text" style={{ alignSelf: 'flex-start' }} onClick={() => store.setRule(gameId, key, null)}>
                  Volver a la original
                </button>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
