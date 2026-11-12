export type Level = 'suave' | 'picante' | 'hot'

export const LEVELS: { id: Level; label: string; hint: string }[] = [
  { id: 'suave', label: 'Suave', hint: 'Para cualquier grupo' },
  { id: 'picante', label: 'Picante', hint: 'Preguntas más jugadas' },
  { id: 'hot', label: 'Hot', hint: 'Solo +18, siempre para responder o señalar' },
]

export interface Phrase {
  id: string
  text: string
  level: Level
  custom?: boolean
}

/** Frase por defecto escrita en el código: el id sale del texto, así sobrevive a reordenamientos. */
export function phrase(text: string, level: Level = 'suave'): Phrase {
  return { id: 'd' + hash(text), text, level }
}

export function phrases(level: Level, texts: string[]): Phrase[] {
  return texts.map((t) => phrase(t, level))
}

export function hash(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}
