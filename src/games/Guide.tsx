import { useEffect, useRef, useState } from 'react'
import { IconChevron, IconPlus } from '../components/Icons'
import { TopBar } from '../components/Layout'
import { CAMBIOS } from '../content/contarReglas'
import { FAMOSOS_INICIO } from '../content/famosos'
import { alarm, buzz, tick, unlockAudio } from '../lib/audio'
import { pick, randInt, sample, shuffle } from '../lib/random'
import { fill, useStore } from '../lib/store'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

type Helper = 'teams' | 'cups' | 'race' | 'coin' | 'starter' | 'pum' | 'contar' | 'famosos' | 'turn' | 'letters' | 'sequence' | 'tally'

const HELPERS: Record<string, Helper[]> = {
  'beer-pong': ['teams', 'cups'],
  'vaso-volteado': ['teams', 'race'],
  monedita: ['coin'],
  thunderstruck: ['starter'],
  pum: ['pum'],
  'contar-reglas': ['contar'],
  famosos: ['famosos'],
  dedo: ['turn'],
  'voy-a-la-barra': ['starter'],
  'dos-verdades': ['turn'],
  burro: ['letters'],
  'culo-sucio': ['starter'],
  'mentiroso-cartas': ['sequence'],
  escoba: ['tally'],
}

const TEAM_NAMES = ['Copas', 'Espadas']

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

function useTeams(players: string[]) {
  const split = () => {
    const s = shuffle(players)
    const half = Math.ceil(s.length / 2)
    return [s.slice(0, half), s.slice(half)]
  }
  const [teams, setTeams] = useState(split)
  return { teams, redraw: () => setTeams(split()) }
}

function Teams({ teams, redraw }: { teams: string[][]; redraw: () => void }) {
  return (
    <Panel title="Equipos">
      <div className="teams">
        {teams.map((t, i) => (
          <div key={i} className={'team team-' + i}>
            <strong>{TEAM_NAMES[i]}</strong>
            <span>{t.join(', ') || 'Nadie'}</span>
          </div>
        ))}
      </div>
      <button className="btn btn-ghost btn-small" onClick={redraw}>Sortear de nuevo</button>
    </Panel>
  )
}

function Cups() {
  const [size, setSize] = useState(6)
  const [left, setLeft] = useState([6, 6])
  const set = (i: number, d: number) => setLeft((l) => l.map((v, j) => (j === i ? Math.max(0, Math.min(size, v + d)) : v)))
  const winner = left.findIndex((v) => v === 0)
  return (
    <Panel title="Vasos que quedan">
      <div className="chips">
        {[6, 10].map((n) => <button key={n} className="chip" aria-pressed={size === n} onClick={() => { setSize(n); setLeft([n, n]) }}>{n} por lado</button>)}
      </div>
      <div className="teams">
        {left.map((v, i) => (
          <div key={i} className={'team team-' + i}>
            <strong>{TEAM_NAMES[i]}</strong>
            <span className="counter-big">{v}</span>
            <div className="btn-row">
              <button className="mini-btn" onClick={() => set(i, 1)} aria-label={`Sumar un vaso a ${TEAM_NAMES[i]}`}><IconPlus /></button>
              <button className="btn btn-small" onClick={() => set(i, -1)}>Embocaron</button>
            </div>
          </div>
        ))}
      </div>
      {winner >= 0 && <p className="verdict-line">Ganó {TEAM_NAMES[1 - winner]}. {TEAM_NAMES[winner]} toma lo que quedó en sus vasos.</p>}
    </Panel>
  )
}

function Race() {
  const { drinks } = useStore()
  const [phase, setPhase] = useState<'idle' | 'count' | 'go'>('idle')
  const [n, setN] = useState(3)
  const [wins, setWins] = useState([0, 0])
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const go = () => {
    unlockAudio()
    setPhase('count'); setN(3); tick()
    timers.current = [
      window.setTimeout(() => { setN(2); tick() }, 900),
      window.setTimeout(() => { setN(1); tick() }, 1800),
      window.setTimeout(() => { alarm(); buzz(300); setPhase('go') }, 2700),
    ]
  }
  return (
    <Panel title="Carrera">
      {phase === 'count' && <p className="countdown-huge" aria-live="assertive">{n}</p>}
      {phase === 'go' && <p className="countdown-huge" aria-live="assertive">¡Ya!</p>}
      {phase === 'go' ? (
        <div className="btn-row">
          {TEAM_NAMES.map((t, i) => (
            <button key={t} className="btn btn-small" onClick={() => { setWins((w) => w.map((v, j) => (j === i ? v + 1 : v))); setPhase('idle') }}>Ganó {t}</button>
          ))}
        </div>
      ) : phase === 'idle' ? (
        <button className="btn btn-small" onClick={go}>Largar</button>
      ) : null}
      <p className="hint">Copas {wins[0]}, Espadas {wins[1]}. {fill('Los que pierden toman {1} cada uno.', [], drinks)}</p>
    </Panel>
  )
}

function Coin({ players }: { players: string[] }) {
  const { drinks } = useStore()
  const [turn, setTurn] = useState(0)
  const [streak, setStreak] = useState(0)
  const [msg, setMsg] = useState('')
  const who = players[turn % players.length]
  return (
    <Panel title={`Tira ${who}`}>
      <p className="hint" style={{ marginTop: 0 }}>{streak > 0 ? `Lleva ${streak} seguidas.` : 'Todavía no embocó.'}</p>
      <div className="btn-row">
        <button className="btn btn-small" onClick={() => {
          const s = streak + 1
          setStreak(s)
          setMsg(s >= 3 ? `¡Tres seguidas! ${who} inventa una regla.` : `${who} elige quién toma ${drinks(1)} y vuelve a tirar.`)
          if (s >= 3) setStreak(0)
        }}>Embocó</button>
        <button className="btn btn-ghost btn-small" onClick={() => { setStreak(0); setMsg(''); setTurn(turn + 1) }}>Falló</button>
      </div>
      {msg && <p className="verdict-line">{msg}</p>}
    </Panel>
  )
}

function Starter({ players, label = 'Arranca' }: { players: string[]; label?: string }) {
  const draw = () => ({ who: pick(players), dir: pick(['para la derecha', 'para la izquierda']) })
  const [s, setS] = useState(draw)
  return (
    <Panel title={label}>
      <p className="big-name">{s.who}</p>
      <p className="hint" style={{ marginTop: 0 }}>Y se sigue {s.dir}.</p>
      <button className="btn btn-ghost btn-small" onClick={() => setS(draw())}>Sortear de nuevo</button>
    </Panel>
  )
}

function Turn({ players }: { players: string[] }) {
  const [turn, setTurn] = useState(() => randInt(0, players.length - 1))
  return (
    <Panel title="Le toca a">
      <p className="big-name">{players[turn % players.length]}</p>
      <button className="btn btn-small" onClick={() => setTurn(turn + 1)}>Siguiente: {players[(turn + 1) % players.length]}</button>
    </Panel>
  )
}

function Pum({ players }: { players: string[] }) {
  const { drinks } = useStore()
  const draw = () => ({ n: randInt(3, 9), who: pick(players) })
  const [s, setS] = useState(draw)
  const [errors, setErrors] = useState(0)
  const examples = Array.from({ length: 40 }, (_, i) => i + 1).filter((x) => x % s.n === 0 || String(x).includes(String(s.n))).slice(0, 6)
  return (
    <Panel title={`El número es ${s.n}`}>
      <p className="hint" style={{ marginTop: 0 }}>Arranca {s.who}. Se dice “pum” en: {examples.join(', ')}…</p>
      <div className="btn-row">
        <button className="btn btn-small" onClick={() => setErrors(errors + 1)}>Alguien le erró</button>
        <button className="btn btn-ghost btn-small" onClick={() => { setS(draw()); setErrors(0) }}>Otro número</button>
      </div>
      {errors > 0 && <p className="verdict-line">{fill('El que le erró toma {1} y se vuelve al 1.', [], drinks)} Van {errors} errores.</p>}
    </Panel>
  )
}

function Contar() {
  const { drinks } = useStore()
  const [rules, setRules] = useState<{ n: number; text: string }[]>([])
  const [msg, setMsg] = useState('')
  const add = () => {
    const free = Array.from({ length: 10 }, (_, i) => i + 1).filter((n) => !rules.some((r) => r.n === n))
    const used = rules.map((r) => r.text)
    if (!free.length) { setMsg('Ya cambiaron los diez números. ¡Son unos genios!'); return }
    const n = pick(free)
    const text = pick(CAMBIOS.filter((c) => !used.includes(c)).length ? CAMBIOS.filter((c) => !used.includes(c)) : CAMBIOS)
    setRules([...rules, { n, text }].sort((a, b) => a.n - b.n))
    setMsg(`Nueva regla para el ${n}.`)
  }
  return (
    <Panel title="Números cambiados">
      {rules.length === 0 ? (
        <p className="hint" style={{ marginTop: 0 }}>Todavía ninguno. Cuenten del 1 al 10 y cuando completen la vuelta, toquen “Vuelta completa”.</p>
      ) : (
        <ol className="count-rules">
          {rules.map((r) => <li key={r.n}><strong>{r.n}</strong><span>{r.text}</span></li>)}
        </ol>
      )}
      <div className="btn-row">
        <button className="btn btn-small" onClick={add}>Vuelta completa</button>
        <button className="btn btn-ghost btn-small" onClick={() => setMsg(fill('El que le erró toma {1}. Vuelvan al 1.', [], drinks))}>Alguien le erró</button>
      </div>
      {msg && <p className="verdict-line">{msg}</p>}
    </Panel>
  )
}

function Famosos({ players }: { players: string[] }) {
  const [turn, setTurn] = useState(0)
  const [first] = useState(() => pick(FAMOSOS_INICIO))
  const [since, setSince] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())
  const [last, setLast] = useState<number | null>(null)
  useEffect(() => {
    if (since === null) return
    const id = window.setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(id)
  }, [since])
  const secs = since === null ? 0 : Math.floor((now - since) / 1000)
  return (
    <Panel title={`Piensa ${players[turn % players.length]}`}>
      {turn === 0 && <p className="hint" style={{ marginTop: 0 }}>Para arrancar: {first}.</p>}
      <p className="countdown-huge" aria-live="polite">{since === null ? '0' : secs}<small> s</small></p>
      <p className="hint">Toma mientras el reloj corre.</p>
      <div className="btn-row">
        {since === null ? (
          <button className="btn btn-small" onClick={() => { setSince(Date.now()); setNow(Date.now()) }}>Empezar a pensar</button>
        ) : (
          <button className="btn btn-small" onClick={() => { setLast(secs); setSince(null); setTurn(turn + 1) }}>Lo dijo</button>
        )}
      </div>
      {last !== null && <p className="verdict-line">El anterior tardó {last} segundos.</p>}
    </Panel>
  )
}

function Letters({ players }: { players: string[] }) {
  const { drinks } = useStore()
  const WORD = 'BURRO'
  const [n, setN] = useState<Record<string, number>>({})
  const burros = players.filter((p) => (n[p] ?? 0) >= WORD.length)
  return (
    <Panel title="Letras">
      <p className="hint" style={{ marginTop: 0 }}>Tocá al último que apoyó la mano.</p>
      <ul className="score-list">
        {players.map((p) => (
          <li key={p}>
            <button className="score-btn" onClick={() => setN({ ...n, [p]: Math.min(WORD.length, (n[p] ?? 0) + 1) })}>
              <span>{p}</span>
              <strong className="letters">{WORD.slice(0, n[p] ?? 0) || '·'}</strong>
            </button>
          </li>
        ))}
      </ul>
      {burros.length > 0 && <p className="verdict-line">{burros.join(', ')} {burros.length > 1 ? 'quedaron BURRO: toman' : 'quedó BURRO: toma'} {drinks(3)}.</p>}
      <button className="btn btn-ghost btn-small" onClick={() => setN({})}>Empezar de cero</button>
    </Panel>
  )
}

function Sequence() {
  const SEQ = ['As', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const [i, setI] = useState(0)
  return (
    <Panel title="Ahora se tiran">
      <p className="big-name">{SEQ[i % SEQ.length]}</p>
      <p className="hint" style={{ marginTop: 0 }}>Con mazo español, la J es la sota, la Q el caballo y la K el rey.</p>
      <button className="btn btn-small" onClick={() => setI(i + 1)}>Siguiente: {SEQ[(i + 1) % SEQ.length]}</button>
    </Panel>
  )
}

function Tally({ players }: { players: string[] }) {
  const { drinks } = useStore()
  const [n, setN] = useState<Record<string, number>>({})
  const [msg, setMsg] = useState('')
  return (
    <Panel title="Escobas">
      <ul className="score-list">
        {players.map((p) => (
          <li key={p}>
            <button className="score-btn" onClick={() => { setN({ ...n, [p]: (n[p] ?? 0) + 1 }); setMsg(`Escoba de ${p}: todos los demás toman ${drinks(1)}.`) }}>
              <span>{p}</span>
              <strong>{n[p] ?? 0}</strong>
            </button>
          </li>
        ))}
      </ul>
      {msg && <p className="verdict-line">{msg}</p>}
      <button className="btn btn-ghost btn-small" onClick={() => { setN({}); setMsg('') }}>Mano nueva</button>
    </Panel>
  )
}

export function Guide({ game }: { game: GameMeta }) {
  useWakeLock()
  const { players, drinks } = useStore()
  const helpers = HELPERS[game.id] ?? ['starter']
  const teams = useTeams(players)
  const [ps] = useState(() => sample(players, players.length))

  return (
    <div className="app-inner" style={{ ['--accent' as string]: 'var(--bastos)', ['--accent-ink' as string]: 'var(--ink)' }}>
      <TopBar title={game.name} close />
      <div className="page page-tight">
        {helpers.map((h) => {
          switch (h) {
            case 'teams': return <Teams key={h} {...teams} />
            case 'cups': return <Cups key={h} />
            case 'race': return <Race key={h} />
            case 'coin': return <Coin key={h} players={ps} />
            case 'starter': return <Starter key={h} players={players} />
            case 'pum': return <Pum key={h} players={players} />
            case 'contar': return <Contar key={h} />
            case 'famosos': return <Famosos key={h} players={ps} />
            case 'turn': return <Turn key={h} players={players} />
            case 'letters': return <Letters key={h} players={players} />
            case 'sequence': return <Sequence key={h} />
            case 'tally': return <Tally key={h} players={players} />
          }
        })}
        <details className="rules-fold">
          <summary>Cómo se juega <IconChevron /></summary>
          <ol className="steps">
            {game.rules.map((r) => <li key={r}>{fill(r, [], drinks)}</li>)}
          </ol>
        </details>
      </div>
    </div>
  )
}

