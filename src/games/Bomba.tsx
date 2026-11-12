import { useEffect, useRef, useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { BOMBA_CATEGORIAS } from '../content/bomba'
import { boom, buzz, tick, unlockAudio } from '../lib/audio'
import { pick, randInt } from '../lib/random'
import { fill, useStore } from '../lib/store'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

const LETTERS = 'ABCDEFGHIJLMNOPRSTUV'.split('')

type Phase = 'ready' | 'ticking' | 'boom'

export function Bomba({ game }: { game: GameMeta }) {
  useWakeLock()
  const store = useStore()
  const cats = store.getList('bomba', BOMBA_CATEGORIAS)
  const [withLetter, setWithLetter] = useState(false)
  const [cat, setCat] = useState(() => pick(cats)?.text ?? 'Cualquier cosa')
  const [letter, setLetter] = useState(() => pick(LETTERS))
  const [phase, setPhase] = useState<Phase>('ready')
  const [beat, setBeat] = useState(600)
  const timer = useRef<number | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const light = () => {
    unlockAudio()
    const total = randInt(14, 45) * 1000
    const startAt = performance.now()
    setPhase('ticking')
    const loop = () => {
      const elapsed = performance.now() - startAt
      if (elapsed >= total) {
        boom()
        buzz([400, 100, 400])
        setPhase('boom')
        return
      }
      // el tic-tac se acelera a medida que pasa el tiempo (sin delatar cuánto falta exacto)
      const progress = elapsed / total
      const interval = Math.max(140, 650 - progress * 480 + randInt(-40, 40))
      setBeat(interval)
      tick(progress > 0.75)
      timer.current = window.setTimeout(loop, interval)
    }
    loop()
  }

  const nextCat = () => {
    setCat(pick(cats)?.text ?? 'Cualquier cosa')
    setLetter(pick(LETTERS))
    setPhase('ready')
  }

  const style = { ['--accent' as string]: 'var(--espadas)', ['--accent-ink' as string]: '#fff' }

  return (
    <div className={'app-inner' + (phase === 'boom' ? ' boom-screen' : '')} style={style}>
      <TopBar title={game.name} close />
      <div className="bomb-stage">
        {phase === 'boom' ? (
          <>
            <p className="cat">Boom</p>
            <p style={{ fontSize: 22, margin: 0 }}>{fill('Le explotó al que tiene el celular. Toma {2}.', [], store.drinks)}</p>
          </>
        ) : (
          <>
            <p className="to" style={{ color: 'var(--muted)', margin: 0 }}>Digan…</p>
            <p className="cat">{cat}</p>
            {withLetter && <p className="letter">que empiecen con <strong>{letter}</strong></p>}
            {phase === 'ticking' ? (
              <div className="fuse" style={{ ['--beat' as string]: `${beat}ms` }} aria-label="La bomba está encendida"><i /></div>
            ) : (
              <div className="chips">
                <button className="chip" aria-pressed={!withLetter} onClick={() => setWithLetter(false)}>Sin letra</button>
                <button className="chip" aria-pressed={withLetter} onClick={() => setWithLetter(true)}>Con letra</button>
                <button className="chip" onClick={nextCat}>Otra categoría</button>
              </div>
            )}
            {phase === 'ticking' && <p className="hint">Decí una y pasalo. No se puede repetir.</p>}
          </>
        )}
      </div>
      <Actions>
        {phase === 'ready' && <button className="btn" onClick={light}>Prender la bomba</button>}
        {phase === 'ticking' && <button className="btn btn-ghost" disabled>Está prendida…</button>}
        {phase === 'boom' && <button className="btn" style={{ background: 'var(--card)', color: 'var(--ink)' }} onClick={nextCat}>Otra ronda</button>}
      </Actions>
    </div>
  )
}
