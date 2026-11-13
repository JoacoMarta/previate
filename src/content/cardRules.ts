import type { DeckKind } from '../lib/deck'

export type CardEffect = 'king' | 'puta' | 'bano' | 'regla' | 'companero'

export interface CardRule {
  title: string
  text: string
  effect?: CardEffect
}

export type RuleSet = Record<number, CardRule>

const cascada: CardRule = { title: 'Cascada', text: 'Todos empiezan a tomar a la vez. Arranca el que sacó la carta y nadie puede parar hasta que pare el de su derecha.' }
const vosElegis: CardRule = { title: 'Vos elegís', text: 'Elegís a alguien que toma {2}.' }
const yoTomo: CardRule = { title: 'Yo tomo', text: 'Tomás {2} vos.' }
const piso: CardRule = { title: 'Piso', text: 'Todos tocan el piso. El último toma {1}.' }
const pulgar: CardRule = {
  title: 'Pulgar',
  text: 'El pulgar es tuyo: cuando quieras, apoyalo disimulado en la mesa. Los demás tienen que hacer lo mismo y el último toma {1}. Dura hasta que salga otro 5.',
}
const cielo: CardRule = { title: 'Cielo', text: 'Todos levantan la mano. El último toma {1}.' }
const companero: CardRule = {
  title: 'Compañero',
  text: 'Elegís un compañero: cada vez que vos tomás, toma también. Dura hasta que salga otro 7.',
  effect: 'companero',
}
const rima: CardRule = { title: 'Rima', text: 'Decís una palabra y en ronda van rimando. El que se traba o repite toma {2}.' }
const categoria: CardRule = { title: 'Categoría', text: 'Elegís una categoría (marcas de cerveza, cuadros…) y en ronda dicen una cosa cada uno. El que se traba o repite toma {2}.' }
const yoNunca: CardRule = { title: 'Yo nunca', text: 'Decís un “yo nunca”. Toman {1} los que sí lo hicieron.' }
const regla: CardRule = { title: 'Regla', text: 'Inventás una regla para el resto de la partida. El que no la cumple toma {1}.', effect: 'regla' }
const preguntas: CardRule = {
  title: 'Preguntas',
  text: 'Le hacés una pregunta a alguien, que tiene que contestar con otra pregunta a otra persona, y así. El que duda o responde sin pregunta toma {2}.',
}
const rey: CardRule = {
  title: 'Rey',
  text: 'Echás un poco de tu vaso en el vaso del medio. El que saca el cuarto rey se toma el vaso del medio.',
  effect: 'king',
}

export function reyDeCopasRules(deck: DeckKind): RuleSet {
  if (deck === 'francesa') {
    return { 1: cascada, 2: vosElegis, 3: yoTomo, 4: piso, 5: pulgar, 6: cielo, 7: companero, 8: rima, 9: categoria, 10: yoNunca, 11: regla, 12: preguntas, 13: rey }
  }
  const base: RuleSet = { 1: cascada, 2: vosElegis, 3: yoTomo, 4: piso, 5: pulgar, 6: cielo, 7: companero, 10: regla, 11: preguntas, 12: rey }
  if (deck === 'espanola48') return { ...base, 8: rima, 9: categoria }
  return base
}

const reparti = (n: number): CardRule => ({
  title: `Repartí ${n}`,
  text: `Repartís {${n}} entre los demás como quieras: todo a uno o de a poco.`,
})

export function laPutaRules(deck: DeckKind): RuleSet {
  const base: RuleSet = {
    1: reparti(1),
    2: reparti(2),
    3: reparti(3),
    4: reparti(4),
    5: reparti(5),
    6: reparti(6),
    7: {
      title: 'Baño',
      text: 'Te ganaste un pase para ir al baño. Sin pase no se puede ir; el que va igual toma {3}. Lo usás cuando quieras.',
      effect: 'bano',
    },
    10: regla,
    11: categoria,
    12: {
      title: 'La puta',
      text: 'Elegís a tu puta: cada vez que vos tomás, toma también. Dura hasta que salga otro 12.',
      effect: 'puta',
    },
  }
  if (deck === 'espanola48') return { ...base, 8: yoNunca, 9: rima }
  return base
}

export function rulesFor(gameId: string, deck: DeckKind): RuleSet {
  return gameId === 'la-puta' ? laPutaRules(deck) : reyDeCopasRules(deck)
}

export function ruleKey(deck: DeckKind, value: number) {
  return `${deck}:${value}`
}
