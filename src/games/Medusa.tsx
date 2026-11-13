import { useEffect, useRef, useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { alarm, buzz, tick, unlockAudio } from '../lib/audio'
import { fill, useStore } from '../lib/store'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

type Phase = 'down' | 'count' | 'up'

export function Medusa({ game }: { game: GameMeta }) {
  useWakeLock()
  const { drinks } = useStore()
  const [phase, setPhase] = useState<Phase>('down')
  const [n, setN] = useState(3)
  const [round, setRound] = useState(1)
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const count = () => {
    unlockAudio()
    setPhase('count')
    setN(3)
    tick()
    timers.current = [
      window.setTimeout(() => { setN(2); tick() }, 1000),
      window.setTimeout(() => { setN(1); tick() }, 2000),
      window.setTimeout(() => { alarm(); buzz(400); setPhase('up') }, 3000),
    ]
  }

  return (
    <div className="app-inner" style={{ ['--accent' as string]: 'var(--espadas)', ['--accent-ink' as string]: '#fff' }}>
      <TopBar title={game.name} close />
      <div className="pass">
        {phase === 'down' && (
          <>
            <p className="who">Miren para abajo</p>
            <p className="note">Ronda {round}. Cuando estén todos mirando al piso, toquen Contar.</p>
          </>
        )}
        {phase === 'count' && <p className="who countdown-huge" aria-live="assertive">{n}</p>}
        {phase === 'up' && (
          <>
            <p className="who">¡Arriba!</p>
            <p className="note">{fill('Si dos se miraron a los ojos, griten “¡Medusa!” y tomen {1}. El último en gritar toma {1} más.', [], drinks)}</p>
          </>
        )}
      </div>
      <Actions>
        {phase === 'down' && <button className="btn" onClick={count}>Contar</button>}
        {phase === 'count' && <button className="btn btn-ghost" disabled>Contando…</button>}
        {phase === 'up' && <button className="btn" onClick={() => { setRound(round + 1); setPhase('down') }}>Otra ronda</button>}
      </Actions>
    </div>
  )
}
