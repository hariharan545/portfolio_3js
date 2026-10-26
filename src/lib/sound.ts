// Tiny WebAudio key sounds, so no audio files are needed.
let ctx: AudioContext | null = null
let muted = (() => {
  try {
    return localStorage.getItem('muted') === '1'
  } catch {
    return false
  }
})()

function audio() {
  if (!ctx) {
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function blip(from: number, to: number, length: number, volume: number) {
  if (muted) return
  const c = audio()
  if (!c) return
  const now = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(from, now)
  osc.frequency.exponentialRampToValueAtTime(to, now + length)
  gain.gain.setValueAtTime(volume, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + length)
  osc.connect(gain).connect(c.destination)
  osc.start(now)
  osc.stop(now + length + 0.02)
}

export const playPress = () => blip(240, 90, 0.09, 0.12)
export const playRelease = () => blip(420, 260, 0.05, 0.05)

export const isMuted = () => muted
export function setMuted(value: boolean) {
  muted = value
  try {
    localStorage.setItem('muted', value ? '1' : '0')
  } catch {
    /* storage can be blocked */
  }
}
