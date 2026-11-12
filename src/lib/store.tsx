import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { load, save } from './storage'
import type { Level, Phrase } from './types'

export type UnitKey = 'trago' | 'sorbo' | 'shot'
export const UNITS: Record<UnitKey, [string, string]> = {
  trago: ['trago', 'tragos'],
  sorbo: ['sorbo', 'sorbos'],
  shot: ['shot', 'shots'],
}

export interface RuleOverride {
  title: string
  text: string
}

interface ListCustom {
  added: Phrase[]
  hidden: string[]
}

interface Persisted {
  players: string[]
  unit: UnitKey
  lists: Record<string, ListCustom>
  rules: Record<string, Record<string, RuleOverride>>
  impostorCats: string[]
}

const KEY = 'previate:v1'
const EMPTY: Persisted = { players: [], unit: 'trago', lists: {}, rules: {}, impostorCats: [] }

interface Store extends Persisted {
  setPlayers: (p: string[]) => void
  setUnit: (u: UnitKey) => void
  /** Frases visibles de una lista: las de fábrica que no ocultaste + las tuyas. */
  getList: (listId: string, defaults: Phrase[]) => Phrase[]
  addPhrase: (listId: string, text: string, level: Level) => void
  removeCustom: (listId: string, id: string) => void
  toggleHidden: (listId: string, id: string) => void
  isHidden: (listId: string, id: string) => boolean
  customOf: (listId: string) => Phrase[]
  setRule: (gameId: string, key: string, rule: RuleOverride | null) => void
  addImpostorCat: (name: string) => void
  removeImpostorCat: (name: string) => void
  resetAll: () => void
  /** "2 tragos", "1 shot"... */
  drinks: (n: number) => string
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Persisted>(() => ({ ...EMPTY, ...load<Partial<Persisted>>(KEY, {}) }))

  useEffect(() => save(KEY, data), [data])

  const list = useCallback((id: string): ListCustom => data.lists[id] ?? { added: [], hidden: [] }, [data.lists])

  const patchList = useCallback((id: string, fn: (l: ListCustom) => ListCustom) => {
    setData((d) => ({ ...d, lists: { ...d.lists, [id]: fn(d.lists[id] ?? { added: [], hidden: [] }) } }))
  }, [])

  const store = useMemo<Store>(
    () => ({
      ...data,
      setPlayers: (players) => setData((d) => ({ ...d, players })),
      setUnit: (unit) => setData((d) => ({ ...d, unit })),
      getList: (id, defaults) => {
        const l = list(id)
        return [...defaults.filter((p) => !l.hidden.includes(p.id)), ...l.added]
      },
      customOf: (id) => list(id).added,
      addPhrase: (id, text, level) =>
        patchList(id, (l) => ({ ...l, added: [...l.added, { id: 'c' + Date.now().toString(36), text, level, custom: true }] })),
      removeCustom: (id, pid) => patchList(id, (l) => ({ ...l, added: l.added.filter((p) => p.id !== pid) })),
      toggleHidden: (id, pid) =>
        patchList(id, (l) => ({ ...l, hidden: l.hidden.includes(pid) ? l.hidden.filter((h) => h !== pid) : [...l.hidden, pid] })),
      isHidden: (id, pid) => list(id).hidden.includes(pid),
      setRule: (gameId, key, rule) =>
        setData((d) => {
          const g = { ...(d.rules[gameId] ?? {}) }
          if (rule) g[key] = rule
          else delete g[key]
          return { ...d, rules: { ...d.rules, [gameId]: g } }
        }),
      addImpostorCat: (name) => setData((d) => (d.impostorCats.includes(name) ? d : { ...d, impostorCats: [...d.impostorCats, name] })),
      removeImpostorCat: (name) =>
        setData((d) => {
          const lists = { ...d.lists }
          delete lists['impostor:' + name]
          return { ...d, lists, impostorCats: d.impostorCats.filter((c) => c !== name) }
        }),
      resetAll: () => setData((d) => ({ ...EMPTY, players: d.players, unit: d.unit })),
      drinks: (n) => `${n} ${UNITS[data.unit][n === 1 ? 0 : 1]}`,
    }),
    [data, list, patchList],
  )

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore fuera de StoreProvider')
  return s
}

/**
 * Completa una frase: {a} {b} {c} son jugadores distintos al azar (o los que pases),
 * {1}..{9} son cantidades de tragos en la unidad elegida.
 */
export function fill(text: string, names: string[], drinks: (n: number) => string): string {
  return text
    .replace(/\{([abc])\}/g, (_, k: string) => names['abc'.indexOf(k)] ?? 'alguien')
    .replace(/\{(\d)\}/g, (_, n: string) => drinks(Number(n)))
}
