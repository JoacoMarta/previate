import type { DeckKind } from './deck'
import { load, save } from './storage'
import type { Level } from './types'

export interface GameSetup {
  levels: Level[]
  deck?: DeckKind
}

export function loadSetup(gameId: string, defaults: GameSetup): GameSetup {
  return { ...defaults, ...load<Partial<GameSetup>>('previate:setup:' + gameId, {}) }
}

export function saveSetup(gameId: string, setup: GameSetup) {
  save('previate:setup:' + gameId, setup)
}
