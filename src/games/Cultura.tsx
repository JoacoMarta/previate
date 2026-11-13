import { useMemo, useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { Naipe } from '../components/Naipe'
import { BOMBA_CATEGORIAS } from '../content/bomba'
import { pick, shuffle } from '../lib/random'
import { fill, useStore } from '../lib/store'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

const LETTERS = 'ABCDEFGHIJLMNOPRSTV'.split('')

export function Cultura({ game }: { game: GameMeta }) {
  useWakeLock()
  const store = useStore()
  const { players, drinks } = store
  const cats = useMemo(() => shuffle(store.getList('cultura', BOMBA_CATEGORIAS)), [])
  const [i, setI] = useState(0)
  const [withLetter, setWithLetter] = useState(false)
  const [letter, setLetter] = useState(() => pick(LETTERS))
  const starter = players[i % players.length]
  const cat = cats.length ? cats[i % cats.length].text : 'Cualquier cosa'

  return (
    <div className="app-inner" style={{ ['--accent' as string]: 'var(--oros)' }}>
      <TopBar title={game.name} close />
      <div className="table">
        <div className="table-meta"><span>Arranca <strong>{starter}</strong></span><span>{i + 1}</span></div>
        <Naipe suit="oros" kind="Cultura chupística" dealKey={cat + i}>
          <p className="prompt">{cat}</p>
          {withLetter && <p className="sub">Con la letra <strong className="letter-big">{letter}</strong></p>}
          <p className="sub">{fill('En ronda, uno cada uno. El que se traba o repite toma {2}.', [], drinks)}</p>
        </Naipe>
        <div className="chips">
          <button className="chip" aria-pressed={!withLetter} onClick={() => setWithLetter(false)}>Sin letra</button>
          <button className="chip" aria-pressed={withLetter} onClick={() => setWithLetter(true)}>Con letra</button>
        </div>
      </div>
      <Actions>
        <button className="btn" onClick={() => { setI(i + 1); setLetter(pick(LETTERS)) }}>Otra categoría</button>
      </Actions>
    </div>
  )
}
