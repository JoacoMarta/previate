import { useEffect, useRef, useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { boom, buzz, kick, unlockAudio } from '../lib/audio'
import { randInt } from '../lib/random'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

type Phase = 'ready' | 'playing' | 'boom'

export function PptCancion({ game }: { game: GameMeta }) {
  useWakeLock()
  const [phase, setPhase] = useState<Phase>('ready')
  const [beat, setBeat] = useState(0)
  const timer = useRef<number | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const start = () => {
    unlockAudio()
    setPhase('playing')
    const total = randInt(35, 75) * 1000
    const t0 = performance.now()
    let n = 0
    const loop = () => {
      const elapsed = performance.now() - t0
      if (elapsed >= total) {
        boom()
        buzz([500, 100, 500])
        setPhase('boom')
        return
      }
      // de 95 a ~230 pulsos por minuto, cada vez más rápido
      const p = elapsed / total
      const bpm = 95 + 135 * p * p
      kick(n % 4 === 0)
      n++
      setBeat(n)
      timer.current = window.setTimeout(loop, 60000 / bpm)
    }
    loop()
  }

  const stop = () => {
    if (timer.current) clearTimeout(timer.current)
    setPhase('ready')
  }

  return (
    <div className={'app-inner' + (phase === 'boom' ? ' boom-screen' : '')} style={{ ['--accent' as string]: 'var(--espadas)', ['--accent-ink' as string]: '#fff' }}>
      <TopBar title={game.name} close />
      <div className="pass">
        {phase === 'ready' && (
          <>
            <p className="who">Piedra, papel o tijera</p>
            <p className="note">Pónganse en ronda. Cuando toquen Arrancar, empieza un ritmo que se va acelerando y en algún momento explota.</p>
          </>
        )}
        {phase === 'playing' && (
          <>
            <div className={'pulse' + (beat % 2 ? ' on' : '')} aria-hidden="true" />
            <p className="note" aria-live="polite">Sigan jugando. Nadie sabe cuándo explota.</p>
          </>
        )}
        {phase === 'boom' && (
          <>
            <p className="who">¡Explotó!</p>
            <p className="note" style={{ color: 'var(--card)' }}>El que estaba perdiendo hace fondo blanco.</p>
          </>
        )}
      </div>
      <Actions>
        {phase === 'ready' && <button className="btn" onClick={start}>Arrancar</button>}
        {phase === 'playing' && <button className="btn btn-ghost" onClick={stop}>Frenar</button>}
        {phase === 'boom' && <button className="btn" style={{ background: 'var(--card)', color: 'var(--ink)' }} onClick={() => setPhase('ready')}>Otra ronda</button>}
      </Actions>
    </div>
  )
}
