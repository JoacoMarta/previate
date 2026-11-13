import { useMemo, useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { Naipe } from '../components/Naipe'
import { ADIVINA } from '../content/adivina'
import { alarm, buzz, tick, unlockAudio } from '../lib/audio'
import { shuffle } from '../lib/random'
import { fill, useStore } from '../lib/store'
import { formatClock, useCountdown } from '../lib/useCountdown'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

type Mode = 'mimica' | 'describir' | 'frente'
type Phase = 'setup' | 'pass' | 'play' | 'result'

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: 'mimica', label: 'Mímica', hint: 'Sin hablar ni hacer ruidos.' },
  { id: 'describir', label: 'Describir', hint: 'Sin decir la palabra ni partes de ella.' },
  { id: 'frente', label: 'En la frente', hint: 'Celular en la frente con la pantalla para afuera. Los demás te dan pistas.' },
]

export function Adivina({ game }: { game: GameMeta }) {
  useWakeLock()
  const store = useStore()
  const { players, drinks } = store
  const pool = useMemo(() => store.getList('adivina', ADIVINA).map((p) => p.text), [])
  const [mode, setMode] = useState<Mode>('mimica')
  const [secs, setSecs] = useState(60)
  const [phase, setPhase] = useState<Phase>('setup')
  const [turn, setTurn] = useState(0)
  const [deck, setDeck] = useState<string[]>(() => shuffle(pool))
  const [pos, setPos] = useState(0)
  const [hits, setHits] = useState(0)
  const [passes, setPasses] = useState(0)
  const timer = useCountdown(() => { alarm(); buzz([300, 100, 300]); setPhase('result') }, (l) => { if (l <= 5) tick(l <= 3) })

  const who = players[turn % players.length]
  const word = deck.length ? deck[pos % deck.length] : '…'
  const advance = () => {
    if (pos + 1 >= deck.length) { setDeck(shuffle(pool)); setPos(0) } else setPos(pos + 1)
  }
  const start = () => {
    unlockAudio()
    setHits(0)
    setPasses(0)
    setPhase('play')
    timer.start(secs)
  }
  const nextTurn = () => { setTurn(turn + 1); advance(); setPhase('pass') }
  const style = { ['--accent' as string]: 'var(--espadas)', ['--accent-ink' as string]: '#fff' }

  if (phase === 'setup') {
    return (
      <div className="app-inner" style={style}>
        <TopBar title={game.name} close />
        <div className="page">
          <div className="block">
            <h3>Modo</h3>
            <div className="chips">
              {MODES.map((m) => <button key={m.id} className="chip" aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>{m.label}</button>)}
            </div>
            <p className="hint">{MODES.find((m) => m.id === mode)?.hint}</p>
          </div>
          <div className="block">
            <h3>Tiempo por turno</h3>
            <div className="chips">
              {[45, 60, 90].map((s) => <button key={s} className="chip" aria-pressed={secs === s} onClick={() => setSecs(s)}>{s} segundos</button>)}
            </div>
          </div>
        </div>
        <Actions><button className="btn" onClick={() => setPhase('pass')}>Empezar</button></Actions>
      </div>
    )
  }

  if (phase === 'pass') {
    return (
      <div className="app-inner" style={style}>
        <TopBar title={game.name} close />
        <div className="pass">
          <p className="who">{who}</p>
          <p className="note">
            {mode === 'frente'
              ? 'Te toca adivinar. Cuando toques Arrancar, ponete el celular en la frente con la pantalla para afuera.'
              : `Te toca ${mode === 'mimica' ? 'actuar' : 'describir'}. Que los demás no miren la pantalla.`}
          </p>
        </div>
        <Actions><button className="btn" onClick={start}>Arrancar</button></Actions>
      </div>
    )
  }

  if (phase === 'play') {
    return (
      <div className={'app-inner' + (mode === 'frente' ? ' frente' : '')} style={style}>
        <TopBar title={formatClock(timer.left ?? 0)} close />
        <div className="table">
          <div className="table-meta"><span>Adivinadas <strong>{hits}</strong></span><span>Pasadas {passes}</span></div>
          <Naipe suit="espadas" kind={MODES.find((m) => m.id === mode)?.label} dealKey={word + pos}>
            <p className="secret-word">{word}</p>
          </Naipe>
        </div>
        <Actions>
          <button className="btn btn-ghost" onClick={() => { setPasses(passes + 1); advance() }}>Pasar</button>
          <button className="btn" onClick={() => { setHits(hits + 1); tick(true); advance() }}>Adivinaron</button>
        </Actions>
      </div>
    )
  }

  return (
    <div className="app-inner" style={style}>
      <TopBar title={game.name} close />
      <div className="table">
        <Naipe suit="espadas" kind="Se terminó el tiempo" dealKey={'r' + turn}>
          <p className="big-value">{hits}</p>
          <p className="rule-title">{hits === 1 ? 'palabra adivinada' : 'palabras adivinadas'}</p>
          <p className="rule-text">
            {hits < 3 ? fill(`Fueron menos de tres: ${who} toma {2}.`, [], drinks) : `${who} reparte ${drinks(hits)}.`}
          </p>
        </Naipe>
      </div>
      <Actions>
        <button className="btn btn-ghost" style={{ flex: '0 0 auto' }} onClick={() => setPhase('setup')}>Opciones</button>
        <button className="btn" onClick={nextTurn}>Le toca a {players[(turn + 1) % players.length]}</button>
      </Actions>
    </div>
  )
}

