import { useEffect, useRef, useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { alarm, buzz, unlockAudio } from '../lib/audio'
import { fill, useStore } from '../lib/store'
import { formatClock } from '../lib/useCountdown'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

export function Reloj({ game }: { game: GameMeta }) {
  useWakeLock()
  const { drinks } = useStore()
  const [every, setEvery] = useState(2)
  const [total, setTotal] = useState(20)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(0)
  const [left, setLeft] = useState(0)
  const [flash, setFlash] = useState(false)
  const nextAt = useRef(0)
  const int = useRef<number | null>(null)
  useEffect(() => () => { if (int.current) clearInterval(int.current) }, [])

  const start = () => {
    unlockAudio()
    setRunning(true)
    nextAt.current = Date.now() + every * 60000
    setLeft(every * 60)
    int.current = window.setInterval(() => {
      const l = Math.max(0, Math.ceil((nextAt.current - Date.now()) / 1000))
      setLeft(l)
      if (l === 0) {
        alarm()
        buzz([300, 100, 300])
        setFlash(true)
        window.setTimeout(() => setFlash(false), 2500)
        setDone((d) => {
          const nd = d + 1
          if (nd >= total) {
            if (int.current) clearInterval(int.current)
            setRunning(false)
          }
          return nd
        })
        nextAt.current = Date.now() + every * 60000
      }
    }, 250)
  }
  const stop = () => {
    if (int.current) clearInterval(int.current)
    setRunning(false)
  }
  const finished = done >= total

  return (
    <div className={'app-inner' + (flash ? ' boom-screen' : '')} style={{ ['--accent' as string]: 'var(--espadas)', ['--accent-ink' as string]: '#fff' }}>
      <TopBar title={game.name} close />
      {!running && done === 0 ? (
        <div className="page">
          <div className="block">
            <h3>Cada cuánto suena</h3>
            <div className="chips">
              {[1, 2, 5, 10].map((m) => <button key={m} className="chip" aria-pressed={every === m} onClick={() => setEvery(m)}>{m === 1 ? '1 minuto' : `${m} minutos`}</button>)}
            </div>
          </div>
          <div className="block">
            <h3>Cuántas veces</h3>
            <div className="chips">
              {[10, 20, 30, 60].map((t) => <button key={t} className="chip" aria-pressed={total === t} onClick={() => setTotal(t)}>{t}</button>)}
            </div>
            <p className="hint">{fill('Cada vez que suena, todos toman {1}.', [], drinks)}</p>
          </div>
        </div>
      ) : (
        <div className="pass">
          <p className="who clock" aria-live="polite">{finished ? 'Listo' : flash ? '¡Tomen!' : formatClock(left)}</p>
          <p className="note">{finished ? `Sonó las ${total} veces.` : `Va ${done} de ${total}.`}</p>
        </div>
      )}
      <Actions>
        {running ? (
          <button className="btn btn-ghost" onClick={stop}>Pausar</button>
        ) : finished ? (
          <button className="btn" onClick={() => setDone(0)}>Empezar de nuevo</button>
        ) : (
          <button className="btn" onClick={start}>{done > 0 ? 'Seguir' : 'Arrancar'}</button>
        )}
      </Actions>
    </div>
  )
}
