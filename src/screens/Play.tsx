import { MAS_PROBABLE } from '../content/masProbable'
import { YO_NUNCA } from '../content/yoNunca'
import { Bomba } from '../games/Bomba'
import { CardRuleGame } from '../games/CardRuleGame'
import { Impostor } from '../games/Impostor'
import { ModoPrevia } from '../games/ModoPrevia'
import { PhraseGame } from '../games/PhraseGame'
import { Piramide } from '../games/Piramide'
import { gameById } from '../games/registry'
import { go } from '../lib/router'
import { loadSetup } from '../lib/setup'
import { useStore } from '../lib/store'
import { NotFound } from './GameDetail'

export function Play({ id }: { id: string }) {
  const game = gameById(id)
  const { players } = useStore()
  if (!game || !game.playable) return <NotFound />
  if (players.length < game.minPlayers) {
    // se entró directo sin jugadores suficientes: volvemos a la ficha
    go('juego/' + id)
    return null
  }
  const setup = loadSetup(id, { levels: ['suave'], deck: game.decks?.[0] })
  const deck = setup.deck && game.decks?.includes(setup.deck) ? setup.deck : game.decks?.[0] ?? 'espanola48'

  switch (id) {
    case 'modo-previa':
      return <ModoPrevia game={game} levels={setup.levels} />
    case 'yo-nunca':
      return <PhraseGame game={game} listId="yo-nunca" defaults={YO_NUNCA} levels={setup.levels} render={(t) => t} reminder="Toman {1} los que sí lo hicieron." />
    case 'mas-probable':
      return (
        <PhraseGame
          game={game}
          listId="mas-probable"
          defaults={MAS_PROBABLE}
          levels={setup.levels}
          render={(t) => `¿Quién es más probable que ${t}?`}
          reminder="A la cuenta de tres, todos señalan. El más señalado toma {2}."
        />
      )
    case 'impostor':
      return <Impostor game={game} />
    case 'bomba':
      return <Bomba game={game} />
    case 'rey-de-copas':
    case 'la-puta':
      return <CardRuleGame game={game} deckKind={deck} />
    case 'piramide':
      return <Piramide game={game} deckKind={deck} />
    default:
      return <NotFound />
  }
}
