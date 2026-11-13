import { useMemo, useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { Naipe, promptClass } from '../components/Naipe'
import { RETOS, VERDADES } from '../content/verdadReto'
import { shuffle } from '../lib/random'
import { fill, useStore } from '../lib/store'
import type { Level } from '../lib/types'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

type Pick = 'verdad' | 'reto'

export function VerdadReto({ game, levels }: { game: GameMeta; levels: Level[] }) {
  useWakeLock()
  const store = useStore()
  const { players, drinks } = store
  const verdades = useMemo(() => shuffle(store.getList('verdades', VERDADES).filter((p) => levels.includes(p.level))), [])
  const retos = useMemo(() => shuffle(store.getList('retos', RETOS)), [])
  const [turn, setTurn] = useState(0)
  const [vi, setVi] = useState(0)
  const [ri, setRi] = useState(0)
  const [shown, setShown] = useState<{ kind: Pick; text: string } | null>(null)

  const who = players[turn % players.length]
  const choose = (kind: Pick) => {
    if (kind === 'verdad') {
      setShown({ kind, text: verdades.length ? verdades[vi % verdades.length].text : 'Contá algo que nadie de la ronda sepa de vos.' })
      setVi(vi + 1)
    } else {
      setShown({ kind, text: retos.length ? retos[ri % retos.length].text : 'Hacé 10 sentadillas.' })
      setRi(ri + 1)
    }
  }
  const next = () => {
    setShown(null)
    setTurn(turn + 1)
  }

  return (
    <div className="app-inner" style={{ ['--accent' as string]: 'var(--oros)' }}>
      <TopBar title={game.name} close />
      {shown ? (
        <>
          <div className="table">
            <div className="table-meta"><span>Le toca a <strong>{who}</strong></span></div>
            <Naipe suit="oros" kind={shown.kind === 'verdad' ? 'Verdad' : 'Reto'} dealKey={shown.text + turn} colorOverride={shown.kind === 'reto' ? 'var(--bastos)' : undefined}>
              <p className={promptClass(shown.text)}>{shown.text}</p>
              <p className="sub">{fill('Si no querés, tomá {2}.', [], drinks)}</p>
            </Naipe>
          </div>
          <Actions>
            <button className="btn" onClick={next}>Le toca a {players[(turn + 1) % players.length]}</button>
          </Actions>
        </>
      ) : (
        <>
          <div className="pass">
            <p className="who">{who}</p>
            <p className="note">Te toca. ¿Verdad o reto?</p>
          </div>
          <Actions>
            <button className="btn" onClick={() => choose('verdad')}>Verdad</button>
            <button className="btn" style={{ background: 'var(--bastos)' }} onClick={() => choose('reto')}>Reto</button>
          </Actions>
        </>
      )}
    </div>
  )
}
