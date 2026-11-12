import { useState } from 'react'
import { Actions, TopBar } from '../components/Layout'
import { Naipe } from '../components/Naipe'
import { PlayerPicker } from '../components/PlayerPicker'
import { ruleKey, rulesFor, type CardRule } from '../content/cardRules'
import { buildDeck, cardName, frenchGlyph, isRed, kingValue, valueIndex, type Card, type DeckKind } from '../lib/deck'
import { fill, useStore } from '../lib/store'
import { useWakeLock } from '../lib/wakeLock'
import type { GameMeta, Suit } from './registry'

const SUIT_OF: Record<string, Suit> = {
  oros: 'oros', copas: 'copas', espadas: 'espadas', bastos: 'bastos',
  corazones: 'copas', diamantes: 'oros', treboles: 'bastos', picas: 'espadas',
}

interface Pair { owner: string; partner: string }

export function CardRuleGame({ game, deckKind }: { game: GameMeta; deckKind: DeckKind }) {
  useWakeLock()
  const store = useStore()
  const { players, drinks } = store
  const base = rulesFor(game.id, deckKind)
  const overrides = store.rules[game.id] ?? {}
  const ruleOf = (v: number): CardRule => {
    const o = overrides[ruleKey(deckKind, v)]
    return o ? { ...base[v], ...o } : base[v]
  }

  const [deck, setDeck] = useState<Card[]>(() => buildDeck(deckKind))
  const [pos, setPos] = useState(0)
  const [turn, setTurn] = useState(0)
  const [card, setCard] = useState<Card | null>(null)
  const [kings, setKings] = useState(0)
  const [pair, setPair] = useState<Pair | null>(null)
  const [passes, setPasses] = useState<Record<string, number>>({})
  const [rules, setRules] = useState<string[]>([])
  const [needsPick, setNeedsPick] = useState(false)
  const [ruleDraft, setRuleDraft] = useState('')

  const current = players.length ? players[turn % players.length] : 'Alguien'
  const rule = card ? ruleOf(card.value) : null
  const isKing = card ? card.value === kingValue(deckKind) && rule?.effect === 'king' : false
  const finished = pos >= deck.length && !card

  const draw = () => {
    const c = deck[pos]
    setCard(c)
    setPos(pos + 1)
    const r = ruleOf(c.value)
    if (r.effect === 'king') setKings((k) => k + 1)
    if (r.effect === 'bano') setPasses((p) => ({ ...p, [current]: (p[current] ?? 0) + 1 }))
    setNeedsPick((r.effect === 'puta' || r.effect === 'companero') && players.length > 1)
    setRuleDraft('')
  }

  const nextTurn = () => {
    if (rule?.effect === 'regla' && ruleDraft.trim()) setRules((rs) => [...rs, ruleDraft.trim()])
    setCard(null)
    setTurn(turn + 1)
  }

  const restart = () => {
    setDeck(buildDeck(deckKind))
    setPos(0)
    setCard(null)
    setKings(0)
    setPair(null)
    setPasses({})
    setRules([])
  }

  const spendPass = (name: string) => setPasses((p) => ({ ...p, [name]: Math.max(0, (p[name] ?? 0) - 1) }))
  const pairLabel = game.id === 'la-puta' ? (p: Pair) => <><strong>{p.partner}</strong> es la puta de <strong>{p.owner}</strong></> : (p: Pair) => <><strong>{p.partner}</strong> toma con <strong>{p.owner}</strong></>
  const passHolders = Object.entries(passes).filter(([, n]) => n > 0)
  const showKings = Object.values(base).some((r) => r.effect === 'king')

  const style = { ['--accent' as string]: 'var(--copas)', ['--accent-ink' as string]: '#fff' }

  return (
    <div className="app-inner" style={style}>
      <TopBar title={game.name} close />
      <div className="status-row">
        <span className="status">Quedan <strong>{deck.length - pos}</strong></span>
        {showKings && <span className="status">Reyes <strong>{kings} de 4</strong></span>}
        {pair && <span className="status">{pairLabel(pair)}</span>}
        {passHolders.map(([name, n]) => (
          <button key={name} className="status" onClick={() => spendPass(name)} aria-label={`Usar un pase al baño de ${name}`}>
            Baño: <strong>{name}</strong>{n > 1 ? ` ×${n}` : ''}
          </button>
        ))}
      </div>
      {passHolders.length > 0 && !card && (
        <p className="hint" style={{ margin: '6px var(--gutter) 0' }}>Cuando alguien use su pase al baño, tocalo para descontarlo.</p>
      )}
      {rules.length > 0 && (
        <div className="rules-active" style={{ marginTop: 10 }}>
          <p>{rules.length === 1 ? 'Regla de la partida' : 'Reglas de la partida'}</p>
          <ul>{rules.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      )}

      <div className="table">
        {finished ? (
          <Naipe suit="copas" dealKey="fin">
            <p className="prompt">Se terminó el mazo.</p>
            <p className="sub">Mezclen y arranquen otra partida.</p>
          </Naipe>
        ) : card && rule ? (
          <>
            <div className="table-meta"><span>Sacó <strong>{current}</strong></span></div>
            <Naipe
              suit={SUIT_OF[card.suit]}
              index={valueIndex(card.value, deckKind)}
              dealKey={card.id}
              glyph={frenchGlyph(card)}
              colorOverride={deckKind === 'francesa' ? (isRed(card) ? 'var(--copas)' : 'var(--ink)') : undefined}
            >
              <div className="big-value">{valueIndex(card.value, deckKind)}</div>
              <p className="card-name">{cardName(card)}</p>
              <p className="rule-title">{rule.title}</p>
              <p className="rule-text">
                {isKing && kings >= 4
                  ? `¡Cuarto rey! ${current} se toma el vaso del medio.`
                  : fill(rule.text, [current], drinks)}
              </p>
            </Naipe>
            {needsPick && (
              <PlayerPicker
                players={players}
                exclude={[current]}
                label={rule.effect === 'puta' ? `${current}, elegí a tu puta` : `${current}, elegí a tu compañero`}
                onPick={(p) => { setPair({ owner: current, partner: p }); setNeedsPick(false) }}
              />
            )}
            {rule.effect === 'regla' && (
              <div className="field">
                <label htmlFor="regla">Anotá la regla para no olvidarla (opcional)</label>
                <input id="regla" className="input" value={ruleDraft} onChange={(e) => setRuleDraft(e.target.value)} placeholder="Ej.: prohibido decir “che”" />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="table-meta"><span>Le toca a <strong>{current}</strong></span></div>
            <button className="deck-back" style={{ ['--suit' as string]: 'var(--copas)' }} onClick={draw}>
              <span>Tocá para sacar</span>
            </button>
          </>
        )}
      </div>
      <Actions>
        {finished ? (
          <button className="btn" onClick={restart}>Mezclar de nuevo</button>
        ) : card ? (
          <button className="btn" onClick={nextTurn} disabled={needsPick}>
            {needsPick ? 'Elegí a alguien' : players.length ? `Le toca a ${players[(turn + 1) % players.length]}` : 'Siguiente'}
          </button>
        ) : (
          <button className="btn" onClick={draw}>Sacar carta</button>
        )}
      </Actions>
    </div>
  )
}
