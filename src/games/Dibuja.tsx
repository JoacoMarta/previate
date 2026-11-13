import { useEffect, useMemo, useRef, useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { Naipe } from '../components/Naipe'
import { PassPhone } from '../components/PassPhone'
import { DIBUJA } from '../content/adivina'
import { alarm, buzz, tick, unlockAudio } from '../lib/audio'
import { shuffle } from '../lib/random'
import { fill, useStore } from '../lib/store'
import { formatClock, useCountdown } from '../lib/useCountdown'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

type Phase = 'secret' | 'draw' | 'result'

function Canvas({ clearKey }: { clearKey: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<[number, number] | null>(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const r = c.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    c.width = r.width * dpr
    c.height = r.height * dpr
    const ctx = c.getContext('2d')!
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 5
    ctx.strokeStyle = '#2a1d17'
  }, [clearKey])

  const pos = (e: React.PointerEvent): [number, number] => {
    const r = ref.current!.getBoundingClientRect()
    return [e.clientX - r.left, e.clientY - r.top]
  }
  return (
    <canvas
      ref={ref}
      key={clearKey}
      className="draw-canvas"
      aria-label="Zona para dibujar"
      onPointerDown={(e) => { drawing.current = true; last.current = pos(e); ref.current?.setPointerCapture(e.pointerId) }}
      onPointerMove={(e) => {
        if (!drawing.current || !last.current) return
        const ctx = ref.current!.getContext('2d')!
        const p = pos(e)
        ctx.beginPath()
        ctx.moveTo(...last.current)
        ctx.lineTo(...p)
        ctx.stroke()
        last.current = p
      }}
      onPointerUp={() => { drawing.current = false; last.current = null }}
      onPointerCancel={() => { drawing.current = false; last.current = null }}
    />
  )
}

export function Dibuja({ game }: { game: GameMeta }) {
  useWakeLock()
  const store = useStore()
  const { players, drinks } = store
  const words = useMemo(() => shuffle(store.getList('dibuja', DIBUJA).map((p) => p.text)), [])
  const [turn, setTurn] = useState(0)
  const [phase, setPhase] = useState<Phase>('secret')
  const [clearKey, setClearKey] = useState(0)
  const [guessed, setGuessed] = useState<boolean | null>(null)
  const timer = useCountdown(() => { alarm(); buzz([300, 100, 300]); setGuessed(false); setPhase('result') }, (l) => { if (l <= 5) tick(l <= 3) })

  const who = players[turn % players.length]
  const word = words.length ? words[turn % words.length] : 'Mate'
  const style = { ['--accent' as string]: 'var(--espadas)', ['--accent-ink' as string]: '#fff' }

  if (phase === 'secret') {
    return (
      <div className="app-inner" style={style}>
        <TopBar title={game.name} close />
        <PassPhone key={turn} name={who} note="Vas a ver la palabra que tenés que dibujar." doneLabel="Empezar a dibujar" onDone={() => { unlockAudio(); setClearKey((k) => k + 1); setPhase('draw'); timer.start(60) }}>
          <Naipe suit="espadas" kind="Tu palabra">
            <p className="secret-word">{word}</p>
            <p className="sub">Sin letras ni números, y sin hablar.</p>
          </Naipe>
        </PassPhone>
      </div>
    )
  }

  if (phase === 'draw') {
    return (
      <div className="app-inner" style={style}>
        <TopBar title={formatClock(timer.left ?? 0)} close right={<button className="btn-text" onClick={() => setClearKey((k) => k + 1)}>Borrar</button>} />
        <div className="draw-wrap"><Canvas clearKey={clearKey} /></div>
        <Actions>
          <button className="btn" onClick={() => { timer.stop(); setGuessed(true); setPhase('result') }}>Adivinaron</button>
        </Actions>
      </div>
    )
  }

  return (
    <div className="app-inner" style={style}>
      <TopBar title={game.name} close />
      <div className="table">
        <Naipe suit="espadas" kind={guessed ? 'Adivinaron' : 'Se terminó el tiempo'} dealKey={'r' + turn}>
          <p className="rule-title">Era “{word}”</p>
          <p className="rule-text">
            {guessed ? fill('El que adivinó primero reparte {2}.', [], drinks) : fill(`Nadie adivinó: ${who} toma {2}.`, [], drinks)}
          </p>
        </Naipe>
      </div>
      <Actions>
        <button className="btn" onClick={() => { setTurn(turn + 1); setPhase('secret') }}>Le toca a {players[(turn + 1) % players.length]}</button>
      </Actions>
    </div>
  )
}
