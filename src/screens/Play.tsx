import { MAS_PROBABLE } from '../content/masProbable'
import { QUE_PREFERIS } from '../content/quePreferis'
import { YO_NUNCA } from '../content/yoNunca'
import { Adivina } from '../games/Adivina'
import { Bomba } from '../games/Bomba'
import { CardRuleGame } from '../games/CardRuleGame'
import { CincoSegundos } from '../games/CincoSegundos'
import { Cultura } from '../games/Cultura'
import { Dibuja } from '../games/Dibuja'
import { FuckTheDealer } from '../games/FuckTheDealer'
import { Guide } from '../games/Guide'
import { Impostor } from '../games/Impostor'
import { Medusa } from '../games/Medusa'
import { Mia } from '../games/Mia'
import { ModoPrevia } from '../games/ModoPrevia'
import { PhraseGame } from '../games/PhraseGame'
import { Piramide } from '../games/Piramide'
import { PptCancion } from '../games/PptCancion'
import { gameById } from '../games/registry'
import { Reloj } from '../games/Reloj'
import { RojoONegro } from '../games/RojoONegro'
import { Ruleta } from '../games/Ruleta'
import { SieteYMedio } from '../games/SieteYMedio'
import { VerdadReto } from '../games/VerdadReto'
import { go } from '../lib/router'
import { loadSetup } from '../lib/setup'
import { useStore } from '../lib/store'
import { NotFound } from './GameDetail'

function TwoOptions({ text }: { text: string }) {
  const [a, b] = text.split('|').map((s) => s.trim())
  return (
    <div className="two-options">
      <p className="prompt">{a}</p>
      <p className="or">o</p>
      <p className="prompt">{b ?? ''}</p>
    </div>
  )
}

export function Play({ id }: { id: string }) {
  const game = gameById(id)
  const { players } = useStore()
  if (!game) return <NotFound />
  if (players.length < game.minPlayers) {
    // se entró directo sin jugadores suficientes: volvemos a la ficha
    go('juego/' + id)
    return null
  }
  const setup = loadSetup(id, { levels: ['suave'], deck: game.decks?.[0] })
  const deck = setup.deck && game.decks?.includes(setup.deck) ? setup.deck : game.decks?.[0] ?? 'espanola48'
  const levels = setup.levels

  switch (id) {
    case 'modo-previa': return <ModoPrevia game={game} levels={levels} />
    case 'yo-nunca':
      return <PhraseGame game={game} listId="yo-nunca" defaults={YO_NUNCA} levels={levels} render={(t) => t} reminder="Toman {1} los que sí lo hicieron." />
    case 'mas-probable':
      return <PhraseGame game={game} listId="mas-probable" defaults={MAS_PROBABLE} levels={levels} render={(t) => `¿Quién es más probable que ${t}?`} reminder="A la cuenta de tres, todos señalan. El más señalado toma {2}." />
    case 'que-preferis':
      return <PhraseGame game={game} listId="que-preferis" defaults={QUE_PREFERIS} levels={levels} render={(t) => <TwoOptions text={t} />} reminder="A la cuenta de tres: mano izquierda para la primera, derecha para la segunda. Toma {1} la minoría." />
    case 'verdad-o-reto': return <VerdadReto game={game} levels={levels} />
    case 'cultura-chupistica': return <Cultura game={game} />
    case '5-segundos': return <CincoSegundos game={game} />
    case 'impostor': return <Impostor game={game} />
    case 'bomba': return <Bomba game={game} />
    case 'adivina': return <Adivina game={game} />
    case 'dibuja': return <Dibuja game={game} />
    case 'medusa': return <Medusa game={game} />
    case 'ruleta': return <Ruleta game={game} levels={levels} />
    case 'piedra-papel-cancion': return <PptCancion game={game} />
    case 'reloj': return <Reloj game={game} />
    case 'rey-de-copas':
    case 'la-puta': return <CardRuleGame game={game} deckKind={deck} />
    case 'piramide': return <Piramide game={game} deckKind={deck} />
    case 'rojo-o-negro': return <RojoONegro game={game} />
    case 'fuck-the-dealer': return <FuckTheDealer game={game} />
    case 'siete-y-medio': return <SieteYMedio game={game} />
    case 'mentiroso-dados': return <Mia game={game} />
    default: return <Guide game={game} />
  }
}
