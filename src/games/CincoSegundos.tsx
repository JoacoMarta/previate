import { useMemo, useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { Naipe } from '../components/Naipe'
import { CINCO_SEGUNDOS } from '../content/cincoSegundos'
import { boom, buzz, tick, unlockAudio } from '../lib/audio'
import { shuffle } from '../lib/random'
import { fill, useStore } from '../lib/store'
import { useCountdown } from '../lib/useCountdown'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

type Phase = 'ready' | 'running' | 'judge' | 'result'

export function CincoSegundos({ game }: { game: GameMeta }) {
  useWakeLock()
  const store = useStore()
  const { players, drinks } = store
  const prompts = useMemo(() => shuffle(store.getList('5-segundos', CINCO_SEGUNDOS)), [])
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState<Phase>('ready')
  const [made, setMade] = useState(false)
  const timer = useCountdown(() => { boom(); buzz(300); setPhase('judge') }, () => tick())

  const who = players[i % players.length]
  const prompt = prompts.length ? prompts[i % prompts.length].text : '3 cosas que hay en la previa'

  const next = () => { setI(i + 1); setPhase('ready') }

  return (
    <div className="app-inner" style={{ ['--accent' as string]: 'var(--oros)' }}>
      <TopBar title={game.name} close />
      <div className="table">
        <div className="table-meta"><span>Le toca a <strong>{who}</strong></span></div>
        <Naipe suit="oros" kind="5 segundos" dealKey={prompt + i}>
          <p className="prompt">{prompt}</p>
          {phase === 'running' && <p className="countdown" aria-live="assertive">{timer.left}</p>}
          {phase === 'result' && (
            <p className="sub">{made ? `${who} zafó.` : fill(`${who} toma {2}.`, [], drinks)}</p>
          )}
        </Naipe>
      </div>
      <Actions>
        {phase === 'ready' && <button className="btn" onClick={() => { unlockAudio(); tick(); setPhase('running'); timer.start(5) }}>Arrancar</button>}
        {phase === 'running' && <button className="btn btn-ghost" disabled>Diciendo…</button>}
        {phase === 'judge' && (
          <>
            <button className="btn btn-ghost" onClick={() => { setMade(false); setPhase('result') }}>No llegó</button>
            <button className="btn" onClick={() => { setMade(true); setPhase('result') }}>Llegó</button>
          </>
        )}
        {phase === 'result' && <button className="btn" onClick={next}>Le toca a {players[(i + 1) % players.length]}</button>}
      </Actions>
    </div>
  )
}
