import type { Phrase } from '../lib/types'
import { ADIVINA, DIBUJA } from './adivina'
import { BOMBA_CATEGORIAS } from './bomba'
import { CINCO_SEGUNDOS } from './cincoSegundos'
import { MAS_PROBABLE } from './masProbable'
import { MODO_PREVIA } from './modoPrevia'
import { QUE_PREFERIS } from './quePreferis'
import { RULETA } from './ruleta'
import { RETOS, VERDADES } from './verdadReto'
import { YO_NUNCA } from './yoNunca'

/** Contenido de fábrica de cada lista editable, por id de lista. */
export const LIST_DEFAULTS: Record<string, Phrase[]> = {
  'modo-previa': MODO_PREVIA,
  'yo-nunca': YO_NUNCA,
  'mas-probable': MAS_PROBABLE,
  'que-preferis': QUE_PREFERIS,
  verdades: VERDADES,
  retos: RETOS,
  cultura: BOMBA_CATEGORIAS,
  bomba: BOMBA_CATEGORIAS,
  '5-segundos': CINCO_SEGUNDOS,
  adivina: ADIVINA,
  dibuja: DIBUJA,
  ruleta: RULETA,
}
