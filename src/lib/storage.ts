// Guardado en el celular. Todo envuelto en try/catch: en modo privado o con
// el almacenamiento bloqueado la app tiene que seguir andando igual.
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // sin guardado: se pierde al cerrar, pero se puede jugar
  }
}
