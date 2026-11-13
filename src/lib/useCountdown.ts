import { useCallback, useEffect, useRef, useState } from 'react'

/** Cuenta regresiva en segundos. Llama onEnd al llegar a 0 y onTick en cada segundo. */
export function useCountdown(onEnd: () => void, onTick?: (left: number) => void) {
  const [left, setLeft] = useState<number | null>(null)
  const timer = useRef<number | null>(null)
  const endRef = useRef(onEnd)
  const tickRef = useRef(onTick)
  endRef.current = onEnd
  tickRef.current = onTick

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
    setLeft(null)
  }, [])

  const start = useCallback((seconds: number) => {
    if (timer.current) clearInterval(timer.current)
    const endAt = Date.now() + seconds * 1000
    setLeft(seconds)
    timer.current = window.setInterval(() => {
      const l = Math.max(0, Math.ceil((endAt - Date.now()) / 1000))
      setLeft((prev) => {
        if (prev !== l && l > 0) tickRef.current?.(l)
        return l
      })
      if (l <= 0) {
        if (timer.current) clearInterval(timer.current)
        timer.current = null
        endRef.current()
      }
    }, 200)
  }, [])

  useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])
  return { left, start, stop, running: left !== null && left > 0 }
}

export function formatClock(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
