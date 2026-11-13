import { useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { Naipe } from '../components/Naipe'
import { PassPhone } from '../components/PassPhone'
import { IMPOSTOR_CATS } from '../content/impostor'
import { pick, sample } from '../lib/random'
import { fill, useStore } from '../lib/store'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta } from './registry'

type Phase = 'setup' | 'reveal' | 'talk' | 'result'

interface Round {
  word: string
  category: string
  impostors: string[]
  starter: string
}

export function Impostor({ game }: { game: GameMeta }) {
  useWakeLock()
  const store = useStore()
  const { players, drinks } = store
  const categories = [...Object.keys(IMPOSTOR_CATS), ...store.impostorCats]
  const wordsOf = (cat: string) => store.getList('impostor:' + cat, IMPOSTOR_CATS[cat] ?? [])

  const [phase, setPhase] = useState<Phase>('setup')
  const [cat, setCat] = useState<string>('azar')
  const [count, setCount] = useState(1)
  const [hint, setHint] = useState(true)
  const [round, setRound] = useState<Round | null>(null)
  const [turn, setTurn] = useState(0)
  const [error, setError] = useState('')

  const start = () => {
    const usable = categories.filter((c) => wordsOf(c).length > 0)
    const category = cat === 'azar' ? pick(usable) : cat
    const words = wordsOf(category)
    if (!words.length) {
      setError('Esa categoría no tiene palabras. Agregale algunas en Editar o elegí otra.')
      return
    }
    setError('')
    setRound({ word: pick(words).text, category, impostors: sample(players, count), starter: pick(players) })
    setTurn(0)
    setPhase('reveal')
  }

  const style = { ['--accent' as string]: 'var(--espadas)', ['--accent-ink' as string]: '#fff' }

  if (phase === 'setup' || !round) {
    return (
      <div className="app-inner" style={style}>
        <TopBar title={game.name} close />
        <div className="page">
          <div className="block">
            <h3>Categoría</h3>
            <div className="chips">
              <button className="chip" aria-pressed={cat === 'azar'} onClick={() => setCat('azar')}>Al azar</button>
              {categories.map((c) => (
                <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
          </div>
          {players.length >= 6 && (
            <div className="block">
              <h3>Impostores</h3>
              <div className="chips">
                {[1, 2].map((n) => (
                  <button key={n} className="chip" aria-pressed={count === n} onClick={() => setCount(n)}>{n}</button>
                ))}
              </div>
            </div>
          )}
          <div className="block">
            <h3>Ayuda para el impostor</h3>
            <div className="chips">
              <button className="chip" aria-pressed={hint} onClick={() => setHint(true)}>Ve la categoría</button>
              <button className="chip" aria-pressed={!hint} onClick={() => setHint(false)}>No ve nada</button>
            </div>
          </div>
          {error && <p className="warn">{error}</p>}
        </div>
        <Actions>
          <button className="btn" onClick={start}>Repartir palabras</button>
        </Actions>
      </div>
    )
  }

  if (phase === 'reveal') {
    const name = players[turn]
    const isImp = round.impostors.includes(name)
    const last = turn === players.length - 1
    return (
      <div className="app-inner" style={style}>
        <TopBar title={game.name} close />
        <PassPhone
          key={name}
          name={name}
          note="Que nadie más mire la pantalla."
          doneLabel={last ? 'Ocultar y empezar' : 'Ocultar y pasar'}
          onDone={() => (last ? setPhase('talk') : setTurn(turn + 1))}
        >
          <Naipe suit="espadas" kind={isImp ? 'Tu rol' : 'Tu palabra'} colorOverride={isImp ? 'var(--copas)' : undefined}>
            {isImp ? (
              <>
                <p className="secret-word impostor">Sos el impostor</p>
                <p className="sub">
                  {hint ? <>La categoría es <strong>{round.category}</strong>. </> : null}
                  Escuchá las pistas y hacete el que sabés.
                </p>
              </>
            ) : (
              <>
                <p className="secret-word">{round.word}</p>
                <p className="sub">Categoría: {round.category}. Da pistas sin ser obvio.</p>
              </>
            )}
          </Naipe>
        </PassPhone>
      </div>
    )
  }

  if (phase === 'talk') {
    return (
      <div className="app-inner" style={style}>
        <TopBar title={game.name} close />
        <div className="pass">
          <p className="who">{round.starter}</p>
          <p className="note">
            Arranca {round.starter}. En ronda, cada uno dice una sola palabra relacionada. Después de una o dos vueltas, a la cuenta de tres señalen a quien creen que es
            {round.impostors.length > 1 ? ' uno de los impostores' : ' el impostor'}.
          </p>
        </div>
        <Actions>
          <button className="btn" onClick={() => setPhase('result')}>Ya votamos, mostrar</button>
        </Actions>
      </div>
    )
  }

  return (
    <div className="app-inner" style={style}>
      <TopBar title={game.name} close />
      <div className="table">
        <Naipe suit="espadas" kind={round.impostors.length > 1 ? 'Los impostores eran' : 'El impostor era'} colorOverride="var(--copas)" dealKey="res">
          <p className="secret-word impostor">{round.impostors.join(' y ')}</p>
          <p className="sub">La palabra era <strong>{round.word}</strong>.</p>
          <p className="sub">
            {fill(`Si lo descubrieron, toma {3}. Si no, toman todos los demás {1}. Si lo descubrieron pero adivinó la palabra, reparte {3}.`, [], drinks)}
          </p>
        </Naipe>
      </div>
      <Actions>
        <button className="btn btn-ghost" style={{ flex: '0 0 auto' }} onClick={() => setPhase('setup')}>Opciones</button>
        <button className="btn" onClick={start}>Otra ronda</button>
      </Actions>
    </div>
  )
}
