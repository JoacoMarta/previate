import { useState } from 'react'
import { TopBar } from '../components/Layout'
import { UNITS, useStore, type UnitKey } from '../lib/store'

export function Settings() {
  const { unit, setUnit, resetAll } = useStore()
  const [confirm, setConfirm] = useState(false)
  return (
    <>
      <TopBar title="Ajustes" />
      <div className="page">
        <div className="block">
          <h3>Cómo se toma</h3>
          <div className="chips">
            {(Object.keys(UNITS) as UnitKey[]).map((u) => (
              <button key={u} className="chip" aria-pressed={unit === u} onClick={() => setUnit(u)}>
                {UNITS[u][1][0].toUpperCase() + UNITS[u][1].slice(1)}
              </button>
            ))}
          </div>
          <p className="hint">Los juegos dicen “tomá 2 {UNITS[unit][1]}”.</p>
        </div>
        <div className="block">
          <h3>Tus cambios</h3>
          <p className="hint" style={{ marginTop: 0 }}>
            Las frases que agregaste, las que ocultaste y las reglas que cambiaste quedan guardadas en este celular.
          </p>
          {confirm ? (
            <div className="btn-row" style={{ marginTop: 12 }}>
              <button className="btn btn-small" style={{ background: 'var(--copas)', color: 'var(--card)' }} onClick={() => { resetAll(); setConfirm(false) }}>
                Sí, borrar mis cambios
              </button>
              <button className="btn btn-ghost btn-small" onClick={() => setConfirm(false)}>Cancelar</button>
            </div>
          ) : (
            <button className="btn btn-ghost btn-small" style={{ marginTop: 12 }} onClick={() => setConfirm(true)}>
              Volver todo a como venía
            </button>
          )}
        </div>
        <div className="block">
          <h3>Instalarla en el celular</h3>
          <ul className="steps">
            <li>iPhone: abrila en Safari, tocá Compartir y después “Agregar a inicio”.</li>
            <li>Android: abrila en Chrome, tocá el menú ⋮ y después “Instalar app”.</li>
            <li>Una vez instalada funciona sin internet.</li>
          </ul>
        </div>
      </div>
    </>
  )
}
