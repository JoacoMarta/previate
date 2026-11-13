import type { DeckKind } from '../lib/deck'

export type Suit = 'oros' | 'copas' | 'espadas' | 'bastos'

export const SUIT_INFO: Record<Suit, { label: string; desc: string }> = {
  oros: { label: 'Frases y preguntas', desc: 'Se lee en voz alta y se juega en ronda.' },
  espadas: { label: 'Pasar el celular', desc: 'El celular va de mano en mano.' },
  copas: { label: 'Cartas y dados', desc: 'La app hace de mazo y lleva la cuenta.' },
  bastos: { label: 'Con cosas o solo reglas', desc: 'La app explica y ayuda con turnos, equipos y marcadores.' },
}

export const SUIT_ORDER: Suit[] = ['oros', 'espadas', 'copas', 'bastos']

export interface EditList {
  id: string
  label: string
  levels: boolean
}

export type EditKind = 'lists' | 'previa' | 'impostor' | 'rules'

export interface GameMeta {
  id: string
  name: string
  aka?: string
  suit: Suit
  short: string
  needs: string
  minPlayers: number
  star?: boolean
  levels?: boolean
  decks?: DeckKind[]
  rules: string[]
  /** Si las reglas no están confirmadas: qué es lo dudoso. Se muestra en el inicio y en la ficha. */
  unconfirmed?: string
  edit?: { kind: EditKind; label: string; lists?: EditList[] }
}

const SOLO_CEL = 'Solo el celular'

export const GAMES: GameMeta[] = [
  // ---------- Oros: frases y preguntas
  {
    id: 'modo-previa', name: 'Modo Previa', suit: 'oros', star: true, levels: true, minPlayers: 2,
    short: 'Una ronda mezclada con sus nombres: retos, reglas, votaciones y duelos.',
    needs: SOLO_CEL,
    rules: [
      'Pongan el celular en el medio. Cada carta dice qué hacer y a quién le toca.',
      'Las reglas duran unas cuantas cartas; la app avisa cuando se terminan.',
      'En las votaciones cuentan hasta tres y todos señalan a la vez.',
      'Los retos son siempre individuales. Si no querés hacerlo, tomás lo que dice la carta.',
    ],
    edit: { kind: 'previa', label: 'Cartas' },
  },
  {
    id: 'yo-nunca', name: 'Yo nunca', suit: 'oros', star: true, levels: true, minPlayers: 2,
    short: 'Se lee un “yo nunca” y toman los que sí lo hicieron.',
    needs: SOLO_CEL,
    rules: ['Uno lee la frase en voz alta.', 'Toman {1} todos los que sí lo hicieron.', 'Si nadie toma, toma el que leyó.', 'Pasen el celular al de al lado para la siguiente.'],
    edit: { kind: 'lists', label: 'Frases', lists: [{ id: 'yo-nunca', label: 'Frases', levels: true }] },
  },
  {
    id: 'mas-probable', name: '¿Quién es más probable?', suit: 'oros', levels: true, minPlayers: 3,
    short: 'A la cuenta de tres todos señalan. El más señalado toma.',
    needs: SOLO_CEL,
    rules: ['Uno lee la pregunta en voz alta.', 'A la cuenta de tres, todos señalan a la vez a quien les parece.', 'El más señalado toma {2}. Si hay empate, toman todos los empatados.'],
    edit: { kind: 'lists', label: 'Preguntas', lists: [{ id: 'mas-probable', label: 'Preguntas', levels: true }] },
  },
  {
    id: 'que-preferis', name: '¿Qué preferís?', suit: 'oros', levels: true, minPlayers: 3,
    short: 'Dos opciones incómodas. Toma la minoría.',
    needs: SOLO_CEL,
    rules: [
      'Uno lee las dos opciones en voz alta.',
      'A la cuenta de tres, cada uno levanta una mano: la izquierda para la primera, la derecha para la segunda.',
      'Toma {1} la minoría. Si quedan parejos, toman todos.',
    ],
    edit: { kind: 'lists', label: 'Preguntas', lists: [{ id: 'que-preferis', label: 'Preguntas (separá las opciones con “ | ”)', levels: true }] },
  },
  {
    id: 'verdad-o-reto', name: 'Verdad o reto', suit: 'oros', levels: true, minPlayers: 2,
    short: 'La app dice a quién le toca. Lo picante va solo en las verdades.',
    needs: SOLO_CEL,
    rules: [
      'La app dice a quién le toca, en el orden de la lista de jugadores.',
      'Elegís verdad o reto. Si no querés responder o hacerlo, tomás {2}.',
      'Las verdades tienen nivel. Los retos son siempre individuales y suaves.',
    ],
    edit: { kind: 'lists', label: 'Verdades y retos', lists: [{ id: 'verdades', label: 'Verdades', levels: true }, { id: 'retos', label: 'Retos', levels: false }] },
  },
  {
    id: 'cultura-chupistica', name: 'Cultura chupística', suit: 'oros', star: true, minPlayers: 2,
    short: 'Sale una categoría y cada uno dice algo en ronda. El que se traba toma.',
    needs: SOLO_CEL,
    rules: [
      '“Cultura chupística, chupística cultura…” Sale una categoría y arranca quien diga la app.',
      'En ronda, cada uno dice algo que entre. El que se traba, repite o tarda más de cinco segundos toma {2}.',
      'Con letra: todo lo que digan tiene que empezar con esa letra.',
    ],
    edit: { kind: 'lists', label: 'Categorías', lists: [{ id: 'cultura', label: 'Categorías', levels: false }] },
  },
  {
    id: '5-segundos', name: '5 segundos', suit: 'oros', minPlayers: 2,
    short: 'Tres respuestas de una categoría en cinco segundos.',
    needs: SOLO_CEL,
    rules: ['Al que le toca lee la consigna en voz alta y toca Arrancar.', 'Tiene cinco segundos para decir las tres cosas.', 'Si no llega, toma {2}. Si llega, sigue el siguiente.'],
    edit: { kind: 'lists', label: 'Consignas', lists: [{ id: '5-segundos', label: 'Consignas', levels: false }] },
  },
  // ---------- Espadas: pasar el celular
  {
    id: 'impostor', name: 'El impostor', suit: 'espadas', star: true, minPlayers: 3,
    short: 'Todos ven la misma palabra menos uno. Den pistas y descubran quién es.',
    needs: SOLO_CEL,
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
    id: 'bomba', name: 'La bomba', suit: 'espadas', minPlayers: 2,
    short: 'Se pasan el celular diciendo palabras. Al que le explota, toma.',
    needs: 'Solo el celular (con volumen)',
    rules: [
      'Sale una categoría. El que tiene el celular dice una palabra que entre y lo pasa al de al lado.',
      'No se puede repetir ni pasar sin decir nada.',
      'La bomba explota en un momento al azar. El que la tiene en la mano toma {2}.',
    ],
    edit: { kind: 'lists', label: 'Categorías', lists: [{ id: 'bomba', label: 'Categorías', levels: false }] },
  },
  {
    id: 'adivina', name: 'Adiviná', suit: 'espadas', minPlayers: 3,
    short: 'Mímica, describir sin decirla, o el celular en la frente.',
    needs: SOLO_CEL,
    rules: [
      'Elijan el modo. Al que le toca tiene 60 segundos para que los demás adivinen todas las palabras que puedan.',
      'Mímica: sin hablar ni hacer ruidos. Describir: sin decir la palabra ni partes de ella.',
      'En la frente: se pone el celular en la frente con la pantalla para afuera y los demás le dan pistas.',
      'Por cada palabra adivinada reparte {1}. Si fueron menos de tres, toma {2}.',
    ],
    edit: { kind: 'lists', label: 'Palabras', lists: [{ id: 'adivina', label: 'Palabras', levels: false }] },
  },
  {
    id: 'dibuja', name: 'Dibujá y adiviná', suit: 'espadas', minPlayers: 3,
    short: 'Uno dibuja en la pantalla y los demás adivinan.',
    needs: SOLO_CEL,
    rules: [
      'Al que le toca ve la palabra en secreto y la dibuja con el dedo en la pantalla.',
      'No vale escribir letras ni números, ni hablar.',
      'Tiene 60 segundos. El primero que adivina reparte {2}. Si nadie adivina, el que dibujó toma {2}.',
    ],
    edit: { kind: 'lists', label: 'Palabras', lists: [{ id: 'dibuja', label: 'Palabras', levels: false }] },
  },
  {
    id: 'medusa', name: 'Medusa', aka: 'Miradas', suit: 'espadas', minPlayers: 3,
    short: 'Todos miran abajo, la app cuenta tres y miran a alguien. Si se cruzan la mirada, toman.',
    needs: 'Solo el celular (con volumen)',
    rules: [
      'Todos miran para abajo.',
      'La app cuenta hasta tres y todos levantan la cabeza mirando a alguien.',
      'Si dos se miran a los ojos, gritan “¡Medusa!” y toman {1}. El último de los dos en gritar toma {1} más.',
    ],
  },
  {
    id: 'ruleta', name: 'Ruleta', suit: 'espadas', levels: true, minPlayers: 2,
    short: 'La ruleta elige a alguien y después sale qué le toca.',
    needs: SOLO_CEL,
    rules: [
      'Giren la ruleta: elige a alguien al azar.',
      'Después sale qué le toca: tomar, repartir, hacer un reto individual o responder una pregunta.',
      'Las preguntas picantes y hot salen solo si eligen esos niveles.',
    ],
    edit: { kind: 'lists', label: 'Castigos', lists: [{ id: 'ruleta', label: 'Castigos', levels: true }] },
  },
  {
    id: 'piedra-papel-cancion', name: 'Piedra, papel o tijera con canción', suit: 'espadas', star: true, minPlayers: 4,
    short: 'En ronda contra el de al lado mientras el ritmo se acelera. El que pierde cuando explota hace fondo blanco.',
    needs: 'Solo el celular (con volumen)',
    unconfirmed: 'Sale de un video de TikTok. Lo de para qué lado se sigue jugando puede no ser como lo juegan ustedes.',
    rules: [
      'Mínimo cuatro, en ronda. Arrancás jugando piedra, papel o tijera con el de tu derecha.',
      'Si ganás, el que perdió se da vuelta y juega con el de su derecha, y así sigue la ronda.',
      'Si perdés, te das vuelta y jugás con el de tu izquierda.',
      'El ritmo se va acelerando. Cuando explota, el que estaba perdiendo hace fondo blanco.',
      'Si prefieren la canción original (“Opus”, de Eric Prydz), pónganla ustedes y usen la app solo para las reglas.',
    ],
  },
  {
    id: 'reloj', name: 'Reloj de tragos', suit: 'espadas', minPlayers: 1,
    short: 'Suena cada tantos minutos y todos toman.',
    needs: 'Solo el celular (con volumen)',
    rules: [
      'Elijan cada cuánto suena y cuántas veces.',
      'Cada vez que suena, todos toman {1}.',
      'Dejen la app abierta y el celular a la vista: la pantalla queda prendida mientras corre.',
    ],
  },
  // ---------- Copas: cartas y dados
  {
    id: 'rey-de-copas', name: 'Rey de copas', aka: 'Anillo de fuego, Kings', suit: 'copas', star: true, minPlayers: 2,
    short: 'Cada carta es una regla. El que saca el cuarto rey se toma el vaso del medio.',
    needs: 'El celular y un vaso en el medio',
    decks: ['espanola48', 'espanola40', 'francesa'],
    rules: [
      'Pongan un vaso vacío en el medio.',
      'Por turno, cada uno toca el mazo y saca una carta. La app muestra qué hace esa carta.',
      'Con cada rey se echa un poco en el vaso del medio. El que saca el cuarto rey se lo toma.',
      'Las reglas de cada carta las pueden cambiar en “Editar reglas de las cartas”.',
    ],
    edit: { kind: 'rules', label: 'Reglas de las cartas' },
  },
  {
    id: 'la-puta', name: 'La Puta', suit: 'copas', star: true, minPlayers: 3,
    short: 'Mazo español en el medio y una regla por carta. El 12 te deja elegir a tu puta.',
    needs: SOLO_CEL,
    decks: ['espanola40', 'espanola48'],
    unconfirmed: 'Es una versión base armada con videos y comentarios: solo está confirmado que del 1 al 6 se reparte y que el 12 es la puta.',
    rules: [
      'Por turno, cada uno saca una carta.',
      'Del 1 al 6 repartís esa cantidad de tragos entre los demás.',
      'El 12 es la puta: elegís a alguien que toma cada vez que vos tomás, hasta que salga otro 12.',
      'El 7 es un pase para ir al baño. La app anota quién lo tiene.',
      'Cada carta se puede cambiar en “Editar reglas de las cartas”.',
    ],
    edit: { kind: 'rules', label: 'Reglas de las cartas' },
  },
  {
    id: 'piramide', name: 'Pirámide', suit: 'copas', star: true, minPlayers: 2,
    short: 'Memorizás tus cartas y mandás tragos cuando sale tu número. Se vale mentir.',
    needs: SOLO_CEL,
    decks: ['francesa', 'espanola48'],
    rules: [
      'Se pasan el celular: cada uno mira sus cartas en secreto y se las tiene que acordar.',
      'Se arma una pirámide de cinco filas boca abajo. La fila de abajo vale {1}, la de arriba {5}.',
      'Se dan vuelta de a una. Si tenés ese número, podés mandarle los tragos de esa fila a alguien.',
      'Se vale mentir. Si te dicen mentiroso, la app muestra si tenías la carta: el que se equivocó toma el doble.',
      'Al final, cada uno dice sus cartas de memoria. Por cada una que erra, toma {1}.',
    ],
  },
  {
    id: 'rojo-o-negro', name: 'Rojo o negro', suit: 'copas', minPlayers: 2,
    short: 'Cuatro preguntas por turno: color, mayor o menor, adentro o afuera, palo.',
    needs: SOLO_CEL,
    decks: ['francesa'],
    rules: [
      'Por turno, cada uno contesta cuatro preguntas y la app da vuelta una carta por pregunta.',
      'Primera: ¿rojo o negro? Segunda: ¿mayor o menor que la primera? Tercera: ¿adentro o afuera de las dos primeras? Cuarta: ¿de qué palo?',
      'Si acertás, repartís tantos tragos como el número de la pregunta. Si errás, los tomás vos.',
      'Si sale una carta igual, cuenta como error.',
    ],
  },
  {
    id: 'fuck-the-dealer', name: 'Fuck the dealer', aka: 'Mayor o menor', suit: 'copas', minPlayers: 3,
    short: 'Adiviná la carta con dos intentos. Si acertás, toma el que reparte.',
    needs: SOLO_CEL,
    decks: ['francesa'],
    rules: [
      'Uno es el dealer. El siguiente adivina qué número sale.',
      'Si acierta a la primera, el dealer toma {4}. Si no, el dealer dice si es mayor o menor y tiene otro intento: si acierta, el dealer toma {2}.',
      'Si erra los dos, toma la diferencia entre lo que dijo y la carta.',
      'Cuando tres seguidos erran, el dealer zafa y le pasa el mazo al siguiente.',
      'La app muestra cuántas de cada número ya salieron.',
    ],
  },
  {
    id: 'siete-y-medio', name: 'Siete y medio borracho', suit: 'copas', minPlayers: 2,
    short: 'Sumar siete y medio sin pasarse. El que se pasa toma.',
    needs: SOLO_CEL,
    decks: ['espanola40'],
    unconfirmed: 'El siete y medio es el de siempre, pero cuánto se toma es una versión base.',
    rules: [
      'Por turno, cada uno pide cartas para acercarse a siete y medio sin pasarse.',
      'Del 1 al 7 valen su número; la sota, el caballo y el rey valen medio.',
      'Si te pasás, tomás {2} y se termina tu turno.',
      'Cuando juegan todos: el que llegó a siete y medio justo reparte {4} y el que quedó más lejos toma {2}.',
    ],
  },
  {
    id: 'mentiroso-dados', name: 'Mentiroso con dados', aka: 'Mía', suit: 'copas', minPlayers: 2,
    short: 'Tirás en secreto, decís lo que sacaste o mentís, y pasás el celular.',
    needs: SOLO_CEL,
    rules: [
      'Tirás dos dados en secreto y decís qué sacaste. Se lee el dado más alto primero: 6 y 3 es 63.',
      'Lo que digas tiene que ganarle a lo que dijo el anterior. Podés mentir.',
      'El siguiente decide: si te cree, tira él y tiene que decir algo más alto. Si no te cree, se muestran tus dados.',
      'Si mentiste, tomás {2}. Si era verdad, toma el que no te creyó. Si estaba en juego la Mía (21), el doble.',
      'Orden: la Mía (21) le gana a todo, después los dobles (66 a 11), después 65, 64 y así hasta 31.',
    ],
  },
  // ---------- Bastos: con cosas o solo reglas
  {
    id: 'beer-pong', name: 'Beer pong', suit: 'bastos', star: true, minPlayers: 2,
    short: 'Embocar la pelotita en los vasos del otro equipo.',
    needs: 'Vasos, una pelotita de ping-pong y una mesa',
    rules: [
      'Dos equipos en las puntas de una mesa, con 6 o 10 vasos por lado y un poco de bebida en cada uno.',
      'Por turno, cada equipo tira la pelotita a los vasos del otro. Si entra, el otro equipo toma ese vaso y lo saca.',
      'Si los dos del equipo embocan en el mismo turno, vuelven a tirar.',
      'Gana el que deja al otro sin vasos. El que pierde toma lo que quedó en sus vasos.',
    ],
  },
  {
    id: 'vaso-volteado', name: 'Vaso volteado', aka: 'Flip cup', suit: 'bastos', minPlayers: 4,
    short: 'Carrera por equipos: tomás y das vuelta el vaso con un dedo.',
    needs: 'Un vaso por persona y una mesa',
    rules: [
      'Dos equipos en fila, uno enfrente del otro, cada uno con su vaso con un poco de bebida.',
      'Cuando la app dice “¡ya!”, arranca el primero de cada fila: toma su vaso, lo apoya boca arriba en el borde de la mesa y lo da vuelta con un dedo hasta que quede boca abajo.',
      'Recién ahí arranca el siguiente de su fila.',
      'Gana el equipo que termina primero. Los del otro equipo toman {1} cada uno.',
    ],
  },
  {
    id: 'monedita', name: 'La monedita', aka: 'Quarters', suit: 'bastos', minPlayers: 2,
    short: 'Hacer rebotar una moneda en la mesa para que caiga en el vaso.',
    needs: 'Una moneda y un vaso',
    rules: [
      'Por turno, cada uno hace rebotar una moneda en la mesa para que caiga en el vaso.',
      'Si emboca, elige quién toma {1} y vuelve a tirar.',
      'Si emboca tres seguidas, inventa una regla.',
      'Si falla, pasa el turno al siguiente.',
    ],
  },
  {
    id: 'thunderstruck', name: 'Thunderstruck', suit: 'bastos', minPlayers: 3,
    short: 'Cada vez que la canción dice “thunder”, el que toma le pasa el turno al siguiente.',
    needs: 'La canción “Thunderstruck” de AC/DC, que ponen ustedes',
    rules: [
      'Pongan “Thunderstruck”. Arranca quien diga la app y se sigue en el sentido que diga.',
      'Con el primer “thunder”, el que arranca empieza a tomar y no para hasta el próximo “thunder”: ahí le pasa el turno al siguiente.',
      'Sigue así hasta que termine la canción.',
    ],
  },
  {
    id: 'pum', name: 'Pum', suit: 'bastos', minPlayers: 3,
    short: 'Cuentan en ronda y en los múltiplos del número se dice “pum”.',
    needs: 'Nada',
    rules: [
      'Cuentan en ronda desde el 1.',
      'En cada múltiplo del número que diga la app, y en los que lo llevan adentro (como el 17 con el 7), en vez del número se dice “pum”.',
      'El que se equivoca o tarda toma {1} y se vuelve a empezar desde el 1.',
    ],
  },
  {
    id: 'contar-reglas', name: 'Contar con reglas', suit: 'bastos', minPlayers: 3,
    short: 'Cuentan hasta 10 y cada vuelta un número se cambia por un gesto o un sonido.',
    needs: 'Nada',
    unconfirmed: 'Sale de un video de TikTok: está la mecánica, pero los cambios de cada número los inventamos.',
    rules: [
      'Cuentan en ronda del 1 al 10, uno cada uno.',
      'Cada vez que completan una vuelta, la app cambia un número por otra cosa: un gesto, un sonido o una palabra.',
      'Los cambios se acumulan. El que se equivoca toma {1} y se vuelve al 1.',
    ],
  },
  {
    id: 'famosos', name: 'Famosos encadenados', aka: 'Tomá hasta que pienses', suit: 'bastos', minPlayers: 2,
    short: 'Un famoso que empiece con la inicial del apellido del anterior. Tomás mientras pensás.',
    needs: 'Nada',
    rules: [
      'Arranca quien diga la app con un famoso, por ejemplo Luis Suárez.',
      'El siguiente dice un famoso cuyo nombre empiece con la inicial del apellido anterior: S de Suárez, Shakira.',
      'Mientras pensás, tomás. Cuanto más tardás, más tomás.',
      'No se pueden repetir famosos.',
    ],
  },
  {
    id: 'dedo', name: 'El dedo', suit: 'bastos', minPlayers: 3,
    short: 'Dedos en el vaso y un número al azar. El último que queda toma.',
    needs: 'Un vaso',
    unconfirmed: 'Hay varias versiones con este nombre y esta es una base. Si lo juegan distinto, sigan la suya.',
    rules: [
      'Todos apoyan un dedo en el borde de un vaso.',
      'Al que le toca dice un número en voz alta y, en ese mismo momento, cada uno decide si saca el dedo o lo deja.',
      'Si el número coincide con los dedos que quedaron en el vaso, el que lo dijo se salva y sale del juego.',
      'Sigue el siguiente. El último que queda toma {2}.',
    ],
  },
  {
    id: 'voy-a-la-barra', name: 'Voy a la barra', suit: 'bastos', minPlayers: 3,
    short: 'Cada uno repite la lista de pedidos y agrega uno.',
    needs: 'Nada',
    rules: [
      'Arranca quien diga la app: “Voy a la barra y pido un fernet”.',
      'El siguiente repite todo y agrega algo: “Voy a la barra y pido un fernet y una cerveza”.',
      'El que se olvida algo o lo dice en otro orden toma {2}, y se arranca de nuevo.',
    ],
  },
  {
    id: 'dos-verdades', name: 'Dos verdades y una mentira', suit: 'bastos', minPlayers: 3,
    short: 'Si descubren la mentira, tomás vos. Si no, toman ellos.',
    needs: 'Nada',
    rules: [
      'Por turno, cada uno cuenta tres cosas sobre sí: dos son verdad y una es mentira.',
      'Los demás votan cuál es la mentira.',
      'Toman {1} los que se equivocaron. Si nadie la descubre, el que contó reparte {3}.',
    ],
  },
  {
    id: 'burro', name: 'Burro', suit: 'bastos', minPlayers: 3,
    short: 'Juntar cuatro cartas iguales pasándolas. El último en reaccionar suma una letra.',
    needs: 'Un mazo de verdad',
    rules: [
      'Separen del mazo un grupo de cuatro cartas iguales por jugador (cuatro ases, cuatro reyes…) y repartan cuatro a cada uno.',
      'A la vez, cada uno pasa una carta boca abajo al de su derecha buscando juntar cuatro iguales.',
      'El que las junta apoya la mano en el centro de la mesa, sin avisar. Los demás tienen que hacer lo mismo.',
      'El último en apoyar la mano suma una letra de BURRO. El que completa la palabra toma {3}.',
    ],
  },
  {
    id: 'culo-sucio', name: 'Culo sucio', suit: 'bastos', minPlayers: 3,
    short: 'Formar pares robando cartas. El que se queda con la última, toma.',
    needs: 'Un mazo de verdad',
    unconfirmed: 'Las reglas cambian mucho según el lugar. Esta es una versión base.',
    rules: [
      'Saquen una carta del mazo sin mirarla y guárdenla aparte. Repartan todo el resto.',
      'Cada uno descarta los pares que tenga.',
      'En ronda, cada uno le roba una carta sin mirar al de su derecha. Si forma par, lo descarta.',
      'El que se queda con la última carta, la que no tiene par, es el culo sucio: toma {3}.',
    ],
  },
  {
    id: 'mentiroso-cartas', name: 'Mentiroso con cartas', aka: 'Desconfío', suit: 'bastos', minPlayers: 3,
    short: 'Tirás cartas boca abajo diciendo qué son. Si te agarran mintiendo, tomás.',
    needs: 'Un mazo de verdad',
    rules: [
      'Se reparte todo el mazo.',
      'Por turno, cada uno tira boca abajo de una a cuatro cartas diciendo que son del número que toca. La app muestra cuál toca.',
      'Cualquiera puede decir “¡mentiroso!”. Si mintió, se lleva todas las cartas de la mesa y toma {2}. Si no, se las lleva el que acusó y toma él.',
      'Gana el primero que se queda sin cartas.',
    ],
  },
  {
    id: 'escoba', name: 'Escoba borracha', suit: 'bastos', minPlayers: 2,
    short: 'La escoba de 15 de siempre: cada escoba hace tomar a los demás.',
    needs: 'Un mazo español de 40',
    unconfirmed: 'La escoba es la de siempre; lo que se toma es una versión base.',
    rules: [
      'Se juega la escoba de 15 de siempre, con mazo español de 40.',
      'Cada vez que alguien hace escoba, todos los demás toman {1}. Anótenla en la app.',
      'Al terminar la mano, el que hizo menos puntos toma {2}.',
    ],
  },
]

export function gameById(id: string) {
  return GAMES.find((g) => g.id === id)
}
