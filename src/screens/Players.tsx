import { useState } from 'react'
import { IconDown, IconTrash, IconUp } from '../components/Icons'
import { Actions, TopBar } from '../components/Layout'
import { shuffle } from '../lib/random'
import { back } from '../lib/router'
import { useStore } from '../lib/store'

export function Players() {
  const { players, setPlayers } = useStore()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const add = () => {
    const n = name.trim()
    if (!n) return
    if (players.some((p) => p.toLowerCase() === n.toLowerCase())) {
      setError(`Ya hay alguien que se llama ${n}. Agregale una inicial para distinguirlos.`)
      return
    }
    setPlayers([...players, n])
    setName('')
    setError('')
  }

  const move = (i: number, d: number) => {
    const next = [...players]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    setPlayers(next)
  }

  return (
    <>
      <TopBar title="Jugadores" />
      <div className="page page-tight">
        <p className="hint" style={{ margin: 0 }}>El orden de la lista es el orden de los turnos, en ronda.</p>
        <form className="inline-form" onSubmit={(e) => { e.preventDefault(); add() }}>
          <input
            className="input"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            placeholder="Nombre"
            autoComplete="off"
            enterKeyHint="done"
            maxLength={24}
            aria-label="Nombre del jugador"
          />
          <button className="btn btn-small" type="submit" disabled={!name.trim()}>Agregar</button>
        </form>
        {error && <p className="warn">{error}</p>}
        {players.length === 0 ? (
          <p className="empty">Todavía no hay nadie. Escribí un nombre y tocá Agregar.</p>
        ) : (
          <ul className="player-list">
            {players.map((p, i) => (
              <li key={p}>
                <span className="num">{i + 1}</span>
                <span className="pname">{p}</span>
                <button className="mini-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Subir a ${p}`}><IconUp /></button>
                <button className="mini-btn" onClick={() => move(i, 1)} disabled={i === players.length - 1} aria-label={`Bajar a ${p}`}><IconDown /></button>
                <button className="mini-btn" onClick={() => setPlayers(players.filter((x) => x !== p))} aria-label={`Sacar a ${p}`}><IconTrash /></button>
              </li>
            ))}
          </ul>
        )}
        {players.length > 2 && (
          <div className="btn-row">
            <button className="btn btn-ghost btn-small" onClick={() => setPlayers(shuffle(players))}>Mezclar el orden</button>
            <button className="btn btn-ghost btn-small" onClick={() => setPlayers([])}>Borrar todos</button>
          </div>
        )}
      </div>
      <Actions>
        <button className="btn" onClick={() => back()}>Listo</button>
      </Actions>
    </>
  )
}
