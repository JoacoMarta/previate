import { phrases } from '../lib/types'

export const RULETA = [
  ...phrases('suave', [
    'Tomá {1}.', 'Tomá {2}.', 'Tomá {3}.', 'Repartí {2}.', 'Repartí {4} como quieras.', 'Fondo blanco.',
    'Elegí a alguien que tome {2} con vos.', 'Cascada: arrancás vos y nadie para hasta que pare el de su derecha.',
    'Zafaste: no tomás nada.', 'Inventá una regla para toda la ronda.', 'Toman todos {1} menos vos.',
    'Contá un chiste. Si nadie se ríe, tomá {2}.', 'Cantá un estribillo o tomá {2}.', 'Imitá a alguien de la ronda o tomá {2}.',
    'Cambiá de lugar con quien quieras.', 'Comodín: la próxima vez que te toque tomar, se lo pasás a otro.',
  ]),
  ...phrases('picante', [
    'Decí quién te parece más lindo de la ronda o tomá {3}.', 'Contá tu último chape o tomá {3}.',
    'Contá tu peor cita o tomá {2}.', 'Decí el nombre de tu crush o tomá {4}.', '¿Le escribirías a tu ex esta noche? Respondé o tomá {2}.',
  ]),
  ...phrases('hot', [
    'Contá el lugar más raro donde lo hiciste o tomá {4}.', 'Contá tu fantasía o tomá {4}.',
    'Decí con cuántas personas estuviste o tomá {4}.', 'Decí con quién de la ronda te animarías o tomá {5}.',
  ]),
]
