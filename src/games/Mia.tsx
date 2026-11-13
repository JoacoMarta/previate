import { useState } from 'react'
import { Die } from '../components/Dice'
import { Actions, TopBar } from '../components/Layout'
import { PassPhone } from '../components/PassPhone'
import { randInt } from '../lib/random'
import { useStore } from '../lib/store'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

// De mayor a menor.
const RANK = ['21', '66', '55', '44', '33', '22', '11', '65', '64', '63', '62', '61', '54', '53', '52', '51', '43', '42', '41', '32', '31']
const label = (v: string) => (v === '21' ? 'Mía' : v[0] === v[1] ? `Doble ${v[0]}` : v)
const rank = (v: string) => RANK.indexOf(v)

function roll(): [number, number] {
  return [randInt(1, 6), randInt(1, 6)]
}
function valueOf([a, b]: [number, number]) {
  return String(Math.max(a, b)) + String(Math.min(a, b))
}

type Phase = 'roll' | 'pass' | 'receive' | 'reveal'

export function Mia({ game }: { game: GameMeta }) {
  useWakeLock()
  const { players, drinks } = useStore()
  const [cur, setCur] = useState(0)
  const [phase, setPhase] = useState<Phase>('roll')
  const [dice, setDice] = useState<[number, number]>(roll)
  const [declared, setDeclared] = useState<string | null>(null)
  const [prev, setPrev] = useState<{ who: number; dice: [number, number]; said: string } | null>(null)
  const [verdict, setVerdict] = useState('')

  const nextOf = (i: number) => (i + 1) % players.length
  const options = RANK.filter((v) => !prev || rank(v) < rank(prev.said)).reverse()

  const declare = (v: string) => {
    setPrev({ who: cur, dice, said: v })
    setDeclared(v)
    setPhase('pass')
  }
  const newRound = (starter: number) => {
    setPrev(null)
    setDeclared(null)
    setCur(starter)
    setDice(roll())
    setPhase('roll')
  }
  const believe = () => {
    if (!prev) return
    const me = nextOf(prev.who)
    if (prev.said === '21') {
      setVerdict(`Nadie le gana a la Mía: ${players[me]} toma ${drinks(2)}.`)
      setPhase('reveal')
      return
    }
    setCur(me)
    setDice(roll())
    setPhase('roll')
  }
  const challenge = () => {
    if (!prev) return
    const me = nextOf(prev.who)
    const actual = valueOf(prev.dice)
    const truth = rank(actual) <= rank(prev.said)
    const n = prev.said === '21' ? 4 : 2
    setVerdict(truth
      ? `Era verdad (sacó ${label(actual)}). ${players[me]} toma ${drinks(n)}.`
      : `¡Mintió! Sacó ${label(actual)}. ${players[prev.who]} toma ${drinks(n)}.`)
    setPhase('reveal')
  }
  const style = { ['--accent' as string]: 'var(--copas)', ['--accent-ink' as string]: '#fff' }

  if (phase === 'roll') {
    return (
      <div className="app-inner" style={style}>
        <TopBar title={game.name} close />
        <PassPhone key={'r' + cur + (prev?.said ?? '')} name={players[cur]} note={prev ? `Le creíste a ${players[prev.who]}: tenés que decir algo más alto que ${label(prev.said)}.` : 'Arrancás una ronda nueva: podés decir cualquier cosa.'} doneLabel="Ocultar" onDone={() => {}}>
          <div className="block">
            <h3>Sacaste</h3>
            <div className="dice-row"><Die value={dice[0]} /><Die value={dice[1]} /></div>
            <p className="hint">Eso es {label(valueOf(dice))}. Elegí qué decís (podés mentir):</p>
            <div className="value-grid" role="group" aria-label="Qué decís que sacaste">
              {options.map((v) => (
                <button key={v} className={'value-btn' + (v === valueOf(dice) ? ' truth' : '')} onClick={() => declare(v)} aria-label={label(v)}>
                  <span>{v === '21' ? 'Mía' : v}</span>
                  {(v === '21' || v[0] === v[1]) && <small>{v === '21' ? '21' : 'doble'}</small>}
                </button>
              ))}
            </div>
          </div>
        </PassPhone>
      </div>
    )
  }

  if (phase === 'pass' && prev) {
    const to = players[nextOf(prev.who)]
    return (
      <div className="app-inner" style={style}>
        <TopBar title={game.name} close />
        <div className="pass">
          <p className="who">{to}</p>
          <p className="note">Pasale el celular a {to}. {players[prev.who]} dice que sacó <strong>{label(declared ?? '')}</strong>.</p>
        </div>
        <Actions><button className="btn" onClick={() => setPhase('receive')}>Soy {to}</button></Actions>
      </div>
    )
  }

  if (phase === 'receive' && prev) {
    return (
      <div className="app-inner" style={style}>
        <TopBar title={game.name} close />
        <div className="pass">
          <p className="who">{label(prev.said)}</p>
          <p className="note">Eso dice {players[prev.who]}. ¿Le creés?</p>
        </div>
        <Actions>
          <button className="btn btn-ghost" onClick={challenge}>No le creo</button>
          <button className="btn" onClick={believe}>Le creo</button>
        </Actions>
      </div>
    )
  }

  return (
    <div className="app-inner" style={style}>
      <TopBar title={game.name} close />
      <div className="table">
        {prev && <div className="dice-row"><Die value={prev.dice[0]} /><Die value={prev.dice[1]} /></div>}
        <div className="verdict" role="status"><p className="rule-text">{verdict}</p></div>
      </div>
      <Actions>
        <button className="btn" onClick={() => newRound(prev ? nextOf(prev.who) : 0)}>Ronda nueva</button>
      </Actions>
    </div>
  )
}
