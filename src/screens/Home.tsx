import { IconChevron, IconGear } from '../components/Icons'
import { SuitIcon } from '../components/Suit'
import { GAMES, SUIT_INFO, SUIT_ORDER } from '../games/registry'
import { go } from '../lib/router'
import { useStore } from '../lib/store'

export function Home() {
  const { players } = useStore()
  return (
    <div className="page">
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h1 className="brand">Previate</h1>
          <button className="icon-btn" style={{ marginTop: 18 }} onClick={() => go('ajustes')} aria-label="Ajustes">
            <IconGear />
          </button>
        </div>
        <p className="brand-sub">Juegos de previa para un solo celular. Elegí uno y pasalo.</p>
      </header>

      <button className="players-strip" onClick={() => go('jugadores')}>
        <div className="names">
          {players.length ? (
            <>
              <div className="count">{players.length === 1 ? '1 jugador' : `${players.length} jugadores`}</div>
              <div className="list">{players.join(', ')}</div>
            </>
          ) : (
            <>
              <div className="count">¿Quiénes juegan?</div>
              <div className="list">Cargá los nombres una vez y los usan todos los juegos.</div>
            </>
          )}
        </div>
        <span className="edit">{players.length ? 'Cambiar' : 'Cargar'}</span>
      </button>

      {SUIT_ORDER.map((suit) => {
        const games = GAMES.filter((g) => g.suit === suit).sort((a, b) => Number(b.playable) - Number(a.playable))
        return (
          <section key={suit} className="suit-section" style={{ ['--suit' as string]: `var(--${suit})` }}>
            <div className="suit-head">
              <SuitIcon suit={suit} />
              <div>
                <h2>{SUIT_INFO[suit].label}</h2>
                <p>{SUIT_INFO[suit].desc}</p>
              </div>
            </div>
            {games.map((g) => (
              <button key={g.id} className={'game-row' + (g.playable ? '' : ' is-soon')} onClick={() => go('juego/' + g.id)}>
                <span className="pip" />
                <span className="body">
                  <span className="name">{g.name}</span>
                  <span className="short" style={{ display: 'block' }}>{g.short}</span>
                </span>
                {g.playable ? <span className="chev"><IconChevron /></span> : <span className="soon">Próximamente</span>}
              </button>
            ))}
          </section>
        )
      })}
    </div>
  )
}
