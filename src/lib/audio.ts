// Sonidos sintetizados (sin archivos), para que todo funcione offline.
let ctx: AudioContext | null = null

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new C()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

/** Llamar desde un toque del usuario para que iPhone habilite el audio. */
export function unlockAudio() {
  const a = ac()
  if (!a) return
  const o = a.createOscillator()
  const g = a.createGain()
  g.gain.value = 0
  o.connect(g).connect(a.destination)
  o.start()
  o.stop(a.currentTime + 0.01)
}

export function tick(high = false) {
  const a = ac()
  if (!a) return
  const o = a.createOscillator()
  const g = a.createGain()
  o.type = 'square'
  o.frequency.value = high ? 1320 : 880
  g.gain.setValueAtTime(0.12, a.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.06)
  o.connect(g).connect(a.destination)
  o.start()
  o.stop(a.currentTime + 0.07)
}

export function boom() {
  const a = ac()
  if (!a) return
  const len = a.sampleRate * 1.2
  const buf = a.createBuffer(1, len, a.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
  const src = a.createBufferSource()
  src.buffer = buf
  const f = a.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.setValueAtTime(900, a.currentTime)
  f.frequency.exponentialRampToValueAtTime(80, a.currentTime + 1.1)
  const g = a.createGain()
  g.gain.value = 0.9
  src.connect(f).connect(g).connect(a.destination)
  src.start()
  const o = a.createOscillator()
  const og = a.createGain()
  o.frequency.setValueAtTime(120, a.currentTime)
  o.frequency.exponentialRampToValueAtTime(30, a.currentTime + 0.8)
  og.gain.setValueAtTime(0.7, a.currentTime)
  og.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.9)
  o.connect(og).connect(a.destination)
  o.start()
  o.stop(a.currentTime + 1)
}

export function buzz(ms: number | number[]) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    // iPhone no vibra desde la web
  }
}
