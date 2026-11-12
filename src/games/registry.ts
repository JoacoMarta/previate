import type { DeckKind } from '../lib/deck'

export type Suit = 'oros' | 'copas' | 'espadas' | 'bastos'

export const SUIT_INFO: Record<Suit, { label: string; desc: string }> = {
  oros: { label: 'Frases y preguntas', desc: 'Se lee en voz alta y se juega en ronda.' },
  espadas: { label: 'Pasar el celular', desc: 'El celular va de mano en mano.' },
  copas: { label: 'Cartas y dados', desc: 'La app hace de mazo y lleva la cuenta.' },
  bastos: { label: 'Con cosas o solo reglas', desc: 'Hace falta algo de la casa o la app explica cómo se juega.' },
}

export const SUIT_ORDER: Suit[] = ['oros', 'espadas', 'copas', 'bastos']

export type EditKind = 'list' | 'previa' | 'impostor' | 'rules'

export interface GameMeta {
  id: string
  name: string
  aka?: string
  suit: Suit
  short: string
  needs: string
  minPlayers: number
  playable: boolean
  star?: boolean
  levels?: boolean
  decks?: DeckKind[]
  rules?: string[]
  edit?: { kind: EditKind; listId?: string; label: string }
}

const soon = (id: string, name: string, suit: Suit, short: string, needs = 'Solo el celular', aka?: string): GameMeta => ({
  id, name, suit, short, needs, aka, minPlayers: 2, playable: false,
})

export const GAMES: GameMeta[] = [
  // ---------- Oros: frases y preguntas
  {
    id: 'modo-previa', name: 'Modo Previa', suit: 'oros', star: true, levels: true, playable: true, minPlayers: 2,
    short: 'Una ronda mezclada con sus nombres: retos, reglas, votaciones y duelos.',
    needs: 'Solo el celular',
    rules: [
      'Pongan el celular en el medio. Cada carta dice qué hacer y a quién le toca.',
      'Las reglas duran unas cuantas cartas; la app avisa cuando se terminan.',
      'En las votaciones cuentan hasta tres y todos señalan a la vez.',
      'Los retos son siempre individuales. Si no querés hacerlo, tomás lo que dice la carta.',
    ],
    edit: { kind: 'previa', listId: 'modo-previa', label: 'Cartas' },
  },
  {
    id: 'yo-nunca', name: 'Yo nunca', suit: 'oros', star: true, levels: true, playable: true, minPlayers: 2,
    short: 'Se lee un “yo nunca” y toman los que sí lo hicieron.',
    needs: 'Solo el celular',
    rules: [
      'Uno lee la frase en voz alta.',
      'Toman {1} todos los que sí lo hicieron.',
      'Si nadie toma, toma el que leyó.',
      'Pasen el celular al de al lado para la siguiente.',
    ],
    edit: { kind: 'list', listId: 'yo-nunca', label: 'Frases' },
  },
  {
    id: 'mas-probable', name: '¿Quién es más probable?', suit: 'oros', levels: true, playable: true, minPlayers: 3,
    short: 'A la cuenta de tres todos señalan. El más señalado toma.',
    needs: 'Solo el celular',
    rules: [
      'Uno lee la pregunta en voz alta.',
      'A la cuenta de tres, todos señalan a la vez a quien les parece.',
      'El más señalado toma {2}. Si hay empate, toman todos los empatados.',
    ],
    edit: { kind: 'list', listId: 'mas-probable', label: 'Preguntas' },
  },
  soon('que-preferis', '¿Qué preferís?', 'oros', 'Dos opciones incómodas. Toma la minoría.'),
  soon('verdad-o-reto', 'Verdad o reto', 'oros', 'La app elige a quién le toca. Lo picante va solo en las verdades.'),
  soon('cultura-chupistica', 'Cultura chupística', 'oros', 'Sale una categoría y cada uno dice algo en ronda. El que se traba toma.'),
  soon('5-segundos', '5 segundos', 'oros', 'Tres respuestas de una categoría en cinco segundos.'),
  // ---------- Espadas: pasar el celular
  {
    id: 'impostor', name: 'El impostor', suit: 'espadas', star: true, playable: true, minPlayers: 3,
    short: 'Todos ven la misma palabra menos uno. Den pistas y descubran quién es.',
    needs: 'Solo el celular',
    rules: [
      'Se pasan el celular: cada uno ve su palabra en secreto y la oculta antes de pasarlo.',
      'El impostor no ve la palabra (como mucho, la categoría).',
      'En ronda, cada uno dice una sola palabra relacionada, sin ser obvio.',
      'Después de una o dos vueltas votan. Si descubren al impostor, toma {3}. Si no, toman todos los demás {1}.',
      'Si lo descubren, el impostor tiene una chance de adivinar la palabra: si acierta, reparte {3}.',
    ],
    edit: { kind: 'impostor', label: 'Palabras' },
  },
  {
    id: 'bomba', name: 'La bomba', suit: 'espadas', playable: true, minPlayers: 2,
    short: 'Se pasan el celular diciendo palabras. Al que le explota, toma.',
    needs: 'Solo el celular (con volumen)',
    rules: [
      'Sale una categoría. El que tiene el celular dice una palabra que entre y lo pasa al de al lado.',
      'No se puede repetir ni pasar sin decir nada.',
      'La bomba explota en un momento al azar. El que la tiene en la mano toma {2}.',
    ],
    edit: { kind: 'list', listId: 'bomba', label: 'Categorías' },
  },
  soon('adivina', 'Adiviná', 'espadas', 'Mímica, describir sin decir palabras prohibidas, o el celular en la frente.'),
  soon('dibuja', 'Dibujá y adiviná', 'espadas', 'Uno dibuja en la pantalla y los demás adivinan.'),
  soon('medusa', 'Medusa', 'espadas', 'Todos miran abajo, la app cuenta tres y miran a alguien. Si se cruzan la mirada, toman.', 'Solo el celular', 'Miradas'),
  soon('ruleta', 'Ruleta', 'espadas', 'Sortea jugador y castigo.'),
  soon('piedra-papel-cancion', 'Piedra, papel o tijera con canción', 'espadas', 'En ronda contra el de al lado mientras el ritmo se acelera. Al que pierde cuando explota, hace fondo.', 'Solo el celular (con volumen)'),
  soon('reloj', 'Reloj de tragos', 'espadas', 'Un trago cada tantos minutos.'),
  // ---------- Copas: cartas y dados
  {
    id: 'rey-de-copas', name: 'Rey de copas', aka: 'Anillo de fuego, Kings', suit: 'copas', star: true, playable: true, minPlayers: 2,
    short: 'Cada carta es una regla. El que saca el cuarto rey se toma el vaso del medio.',
    needs: 'El celular y un vaso en el medio',
    decks: ['espanola48', 'espanola40', 'francesa'],
    rules: [
      'Pongan un vaso vacío en el medio.',
      'Por turno, cada uno toca el mazo y saca una carta. La app muestra qué hace esa carta.',
      'Con cada rey se echa un poco en el vaso del medio. El que saca el cuarto rey se lo toma.',
      'Las reglas de cada carta las pueden cambiar en “Editar reglas”.',
    ],
    edit: { kind: 'rules', label: 'Reglas de las cartas' },
  },
  {
    id: 'la-puta', name: 'La Puta', suit: 'copas', star: true, playable: true, minPlayers: 3,
    short: 'Mazo español en el medio y una regla por carta. El 12 te deja elegir a tu puta.',
    needs: 'Solo el celular',
    decks: ['espanola40', 'espanola48'],
    rules: [
      'Por turno, cada uno saca una carta.',
      'Del 1 al 6 repartís esa cantidad de tragos entre los demás.',
      'El 12 es la puta: elegís a alguien que toma cada vez que vos tomás, hasta que salga otro 12.',
      'El 7 es un pase para ir al baño. La app anota quién lo tiene.',
      'Es una versión base: cada carta se puede cambiar en “Editar reglas”.',
    ],
    edit: { kind: 'rules', label: 'Reglas de las cartas' },
  },
  {
    id: 'piramide', name: 'Pirámide', suit: 'copas', star: true, playable: true, minPlayers: 2,
    short: 'Memorizás tus cartas y mandás tragos cuando sale tu número. Se vale mentir.',
    needs: 'Solo el celular',
    decks: ['francesa', 'espanola48'],
    rules: [
      'Se pasan el celular: cada uno mira sus cartas en secreto y se las tiene que acordar.',
      'Se arma una pirámide de cinco filas boca abajo. La fila de abajo vale {1}, la de arriba {5}.',
      'Se dan vuelta de a una. Si tenés ese número, podés mandarle los tragos de esa fila a alguien.',
      'Se vale mentir. Si te dicen mentiroso, la app muestra si tenías la carta: el que se equivocó toma el doble.',
      'Al final, cada uno dice sus cartas de memoria. Por cada una que erra, toma {1}.',
    ],
  },
  soon('rojo-o-negro', 'Rojo o negro', 'copas', 'Las cuatro preguntas: color, mayor o menor, adentro o afuera, palo.'),
  soon('fuck-the-dealer', 'Fuck the dealer', 'copas', 'Adiviná la carta con dos intentos. Si acertás, toma el que reparte.', 'Solo el celular', 'Mayor o menor'),
  soon('siete-y-medio', 'Siete y medio borracho', 'copas', 'Sumar siete y medio sin pasarse. El que se pasa toma.'),
  soon('mentiroso-dados', 'Mentiroso con dados', 'copas', 'Tirás en secreto, decís lo que sacaste o mentís, y pasás el celular.', 'Solo el celular', 'Mía'),
  // ---------- Bastos: con cosas o solo reglas
  soon('beer-pong', 'Beer pong', 'bastos', 'Embocar la pelotita en los vasos del otro equipo.', 'Vasos, una pelotita y una mesa'),
  soon('vaso-volteado', 'Vaso volteado', 'bastos', 'Carrera por equipos: tomás y das vuelta el vaso con un dedo.', 'Un vaso por persona', 'Flip cup'),
  soon('monedita', 'La monedita', 'bastos', 'Hacer rebotar una moneda en la mesa para que caiga en el vaso.', 'Una moneda y un vaso'),
  soon('thunderstruck', 'Thunderstruck', 'bastos', 'Cada vez que la canción dice “thunder”, el que toma le pasa el turno al siguiente.', 'La canción, que ponen ustedes'),
  soon('pum', 'Pum', 'bastos', 'Cuentan en ronda y en cada múltiplo de 7 se dice “pum”.', 'Nada'),
  soon('contar-reglas', 'Contar con reglas', 'bastos', 'Cuentan hasta 10 y cada vuelta un número se cambia por un gesto o un sonido.', 'Nada'),
  soon('famosos', 'Famosos encadenados', 'bastos', 'Un famoso que empiece con la inicial del apellido del anterior. Tomás mientras pensás.', 'Nada', 'Tomá hasta que pienses'),
  soon('dedo', 'El dedo', 'bastos', 'El último en apoyar el dedo en el vaso toma.', 'Nada', 'Pulgar'),
  soon('voy-a-la-barra', 'Voy a la barra', 'bastos', 'Cada uno repite la lista de pedidos y agrega uno.', 'Nada'),
  soon('dos-verdades', 'Dos verdades y una mentira', 'bastos', 'Si descubren la mentira, tomás vos. Si no, toman ellos.', 'Nada'),
  soon('burro', 'Burro', 'bastos', 'Juntar cuatro cartas iguales pasándolas. El último en reaccionar toma.', 'Un mazo de verdad'),
  soon('culo-sucio', 'Culo sucio', 'bastos', 'Formar pares robando cartas. El que se queda con la última, toma.', 'Un mazo de verdad'),
  soon('mentiroso-cartas', 'Mentiroso con cartas', 'bastos', 'Tirás cartas boca abajo diciendo qué son. Si te agarran mintiendo, tomás.', 'Un mazo de verdad'),
  soon('escoba', 'Escoba borracha', 'bastos', 'La escoba de siempre: cada escoba hace tomar a los demás.', 'Un mazo de verdad'),
]

export function gameById(id: string) {
  return GAMES.find((g) => g.id === id)
}
