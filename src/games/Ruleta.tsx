import { useMemo, useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { Naipe, promptClass } from '../components/Naipe'
import { RULETA } from '../content/ruleta'
import { kick, unlockAudio } from '../lib/audio'
import { pick, randInt } from '../lib/random'
import { fill, useStore } from '../lib/store'
import type { Level } from '../lib/types'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

const SLICE_COLORS = ['var(--copas)', 'var(--oros)', 'var(--espadas)', 'var(--bastos)']

function Wheel({ players, angle, spinning }: { players: string[]; angle: number; spinning: boolean }) {
  const n = players.length
  const r = 150
  const slices = players.map((p, i) => {
    const a0 = (i / n) * 2 * Math.PI - Math.PI / 2
    const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2
    const large = a1 - a0 > Math.PI ? 1 : 0
    const x0 = r + r * Math.cos(a0), y0 = r + r * Math.sin(a0)
    const x1 = r + r * Math.cos(a1), y1 = r + r * Math.sin(a1)
    const mid = (a0 + a1) / 2
    const tx = r + r * 0.62 * Math.cos(mid), ty = r + r * 0.62 * Math.sin(mid)
    const color = SLICE_COLORS[i % 4]
    const ink = color === 'var(--oros)' || color === 'var(--bastos)' ? 'var(--ink)' : '#fff'
    return (
      <g key={p}>
        <path d={n === 1 ? `M${r},0 A${r},${r} 0 1,1 ${r - 0.01},0 Z` : `M${r},${r} L${x0},${y0} A${r},${r} 0 ${large},1 ${x1},${y1} Z`} fill={color} stroke="var(--card)" strokeWidth="2" />
        <text x={tx} y={ty} fill={ink} fontSize={n > 12 ? 12 : n > 8 ? 14 : 16} fontWeight="700" textAnchor="middle" dominantBaseline="middle"
          transform={`rotate(${(mid * 180) / Math.PI + 90 + (Math.sin(mid) > 0.0001 ? 180 : 0)} ${tx} ${ty})`}>
          {p.length > 10 ? p.slice(0, 9) + '…' : p}
        </text>
      </g>
    )
  })
  return (
    <div className="wheel-wrap">
      <svg className="wheel-pointer" viewBox="0 0 24 20" aria-hidden="true"><path d="M12 20L2 2h20z" fill="var(--card)" /></svg>
      <svg
        viewBox="0 0 300 300"
        className="wheel"
        style={{ transform: `rotate(${angle}deg)`, transition: spinning ? 'transform 3.6s cubic-bezier(.12,.7,.15,1)' : 'none' }}
        role="img"
        aria-label="Ruleta con los nombres de los jugadores"
      >
        {slices}
        <circle cx="150" cy="150" r="20" fill="var(--card)" />
      </svg>
    </div>
  )
}

export function Ruleta({ game, levels }: { game: GameMeta; levels: Level[] }) {
  useWakeLock()
  const store = useStore()
  const { players, drinks } = store
  const castigos = useMemo(() => store.getList('ruleta', RULETA).filter((p) => levels.includes(p.level)), [])
  const [angle, setAngle] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<{ who: string; text: string } | null>(null)

  const spin = () => {
    unlockAudio()
    const idx = randInt(0, players.length - 1)
    const slice = 360 / players.length
    // el puntero está arriba: la porción idx tiene que quedar centrada en 0°
    const target = 360 - (idx * slice + slice / 2) + randInt(-Math.floor(slice / 3), Math.floor(slice / 3))
    const base = angle - (angle % 360) + 360 * 5
    setResult(null)
    setSpinning(true)
    setAngle(base + target)
    for (let t = 0; t < 14; t++) window.setTimeout(() => kick(), t * t * 18)
    window.setTimeout(() => {
      setSpinning(false)
      setResult({ who: players[idx], text: castigos.length ? pick(castigos).text : 'Tomá {1}.' })
    }, 3700)
  }

  return (
    <div className="app-inner" style={{ ['--accent' as string]: 'var(--espadas)', ['--accent-ink' as string]: '#fff' }}>
      <TopBar title={game.name} close />
      <div className="table">
        {result ? (
          <Naipe suit="espadas" kind="Le tocó" dealKey={result.who + angle}>
            <p className="secret-word">{result.who}</p>
            <p className={promptClass(result.text)} style={{ marginTop: 14 }}>{fill(result.text, [result.who], drinks)}</p>
          </Naipe>
        ) : (
          <Wheel players={players} angle={angle} spinning={spinning} />
        )}
      </div>
      <Actions>
        {result ? (
          <button className="btn" onClick={() => setResult(null)}>Volver a la ruleta</button>
        ) : (
          <button className="btn" onClick={spin} disabled={spinning}>{spinning ? 'Girando…' : 'Girar'}</button>
        )}
      </Actions>
    </div>
  )
}
