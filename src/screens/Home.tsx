import { IconChevron, IconSliders, IconWarn } from '../components/Icons'
import { SuitIcon } from '../components/Suit'
import { GAMES, SUIT_INFO, SUIT_ORDER } from '../games/registry'
import { go } from '../lib/router'
import { useStore } from '../lib/store'

export function Home() {
  const { players } = useStore()
  return (
    <div className="page">
      <header className="home-head">
        <h1 className="brand">Fondo<br />Blanco</h1>
        <button className="icon-btn" onClick={() => go('ajustes')} aria-label="Ajustes">
          <IconSliders />
        </button>
      </header>
      <p className="brand-sub">Juegos de previa para un solo celular. Elegí uno y pasalo.</p>

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
        const games = GAMES.filter((g) => g.suit === suit)
        return (
          <section key={suit} className="suit-section" aria-labelledby={'h-' + suit}>
            <div className="suit-head">
              <SuitIcon suit={suit} />
              <div>
                <h2 id={'h-' + suit}>{SUIT_INFO[suit].label}</h2>
                <p>{SUIT_INFO[suit].desc}</p>
              </div>
            </div>
            <ul className="game-list">
              {games.map((g) => (
                <li key={g.id}>
                  <button className="game-row" onClick={() => go('juego/' + g.id)}>
                    <span className="body">
                      <span className="name">{g.name}</span>
                      <span className="short">{g.short}</span>
                      {g.unconfirmed && (
                        <span className="unconfirmed-tag"><IconWarn />Reglas sin confirmar</span>
                      )}
                    </span>
                    <span className="chev"><IconChevron /></span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
