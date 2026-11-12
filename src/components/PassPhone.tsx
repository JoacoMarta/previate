import { useState, type ReactNode } from 'react'
import { Actions } from './Layout'

/**
 * Pantalla de "pasale el celular a X". Lo secreto solo se muestra cuando la persona toca el botón,
 * y se oculta antes de pasarlo.
 */
export function PassPhone({ name, note, children, doneLabel = 'Listo, ocultar', onDone }: {
  name: string
  note?: string
  children: ReactNode
  doneLabel?: string
  onDone: () => void
}) {
  const [shown, setShown] = useState(false)
  if (!shown) {
    return (
      <>
        <div className="pass">
          <p className="to">Pasale el celular a</p>
          <p className="who">{name}</p>
          {note && <p className="note">{note}</p>}
        </div>
        <Actions>
          <button className="btn" onClick={() => setShown(true)}>Soy {name}, mostrar</button>
        </Actions>
      </>
    )
  }
  return (
    <>
      <div className="table">{children}</div>
      <Actions>
        <button className="btn" onClick={() => { setShown(false); onDone() }}>{doneLabel}</button>
      </Actions>
    </>
  )
}
