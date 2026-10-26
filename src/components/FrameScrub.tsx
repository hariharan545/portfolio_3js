import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import { profile } from '../data/content'

const pad = (n: number) => String(n).padStart(3, '0')

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`failed to load ${src}`))
    img.src = src
  })
}

/**
 * Turns a normal photo into a warm, darker monochrome so a bright sky or office background
 * sits inside the black and orange theme. Done once, not per frame. Cartoon cut-outs
 * (transparent PNGs) skip it, so they keep their own colours.
 */
function toDuotone(img: HTMLImageElement) {
  const probe = document.createElement('canvas')
  probe.width = probe.height = 8
  const pctx = probe.getContext('2d', { willReadFrequently: true })!
  pctx.drawImage(img, 0, 0, 8, 8)
  const px = pctx.getImageData(0, 0, 8, 8).data
  let transparent = false
  for (let i = 3; i < px.length; i += 4) if (px[i] < 250) transparent = true
  if (transparent) return img

  const c = document.createElement('canvas')
  c.width = img.width
  c.height = img.height
  const ctx = c.getContext('2d')!
  ctx.filter = 'grayscale(1) contrast(1.25) brightness(0.8)'
  ctx.drawImage(img, 0, 0)
  ctx.filter = 'none'
  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = '#ff7468'
  ctx.fillRect(0, 0, c.width, c.height)
  return c
}

/** Reads <dir>/meta.json ({ "count": 120 }). Returns null when the folder doesn't exist. */
async function readCount(dir: string): Promise<number | null> {
  try {
    const res = await fetch(`${dir}/meta.json`)
    if (!res.ok) return null
    const meta = (await res.json()) as { count?: number }
    return meta.count && meta.count > 1 ? meta.count : null
  } catch {
    return null // dev servers answer unknown paths with index.html, which isn't JSON
  }
}

/**
 * Scroll-scrubbed character: draws one pre-rendered frame per scroll position on a canvas.
 *
 * - With frames in /public/hero-frames (see scripts/extract_frames.py) the head really turns as you scroll.
 * - Without frames it falls back to the single hero image and fakes a turn with a squash and skew.
 */
export default function FrameScrub({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const mobile = window.matchMedia('(max-width: 767px)').matches
    let frames: (HTMLImageElement | undefined)[] = []
    let still: HTMLCanvasElement | HTMLImageElement | undefined
    let smooth = 0
    let visible = true
    let dead = false
    let raf = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(r.width * dpr))
      canvas.height = Math.max(1, Math.round(r.height * dpr))
    }

    const nearestFrame = (target: number) => {
      for (let d = 0; d < frames.length; d++) {
        const a = frames[target - d]
        if (a) return a
        const b = frames[target + d]
        if (b) return b
      }
      return undefined
    }

    const draw = () => {
      const cw = canvas.width
      const ch = canvas.height
      ctx.clearRect(0, 0, cw, ch)

      if (frames.length) {
        const img = nearestFrame(Math.round(smooth * (frames.length - 1)))
        if (!img) return
        const s = Math.max(cw / img.width, ch / img.height)
        const w = img.width * s
        const h = img.height * s
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
        return
      }

      if (still) {
        const turn = Math.sin(smooth * Math.PI * 2) // -1..1 across the hero scroll
        const h = ch * 1.02 * (1 + smooth * 0.18)
        const w = (still.width * h) / still.height
        const cx = cw * (mobile ? 0.5 : 0.7) + turn * cw * 0.03
        ctx.save()
        ctx.translate(cx, ch)
        ctx.transform(1, 0, turn * 0.06, 1, 0, 0)
        ctx.scale(1 - Math.abs(turn) * 0.06, 1)
        ctx.drawImage(still, -w / 2, -h, w, h)
        ctx.restore()

        // feather the photo's edges into the page with a soft oval centred on the face
        ctx.save()
        ctx.globalCompositeOperation = 'destination-in'
        const ry = h * 0.62
        // squash the circle horizontally so it reaches zero right at the photo's side edges
        ctx.translate(cx, ch - h * 0.58)
        ctx.scale((w * 0.5) / ry, 1)
        const g = ctx.createRadialGradient(0, 0, ry * 0.15, 0, 0, ry)
        g.addColorStop(0, 'rgba(0,0,0,1)')
        g.addColorStop(0.6, 'rgba(0,0,0,0.85)')
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(-cw * 2, -ch * 2, cw * 4, ch * 4)
        ctx.restore()
      }
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      smooth += (progress.get() - smooth) * 0.12 // small lag makes the scrub feel smooth
      draw()
    }

    const start = async () => {
      const dirs = mobile ? [profile.heroFramesMobileDir, profile.heroFramesDir] : [profile.heroFramesDir]
      let dir = ''
      let count: number | null = null
      for (const d of dirs) {
        count = await readCount(d)
        if (count) {
          dir = d
          break
        }
      }
      if (dead) return

      if (!count) {
        const img = await loadImage(profile.heroImage).catch(() => loadImage(profile.heroImageFallback))
        if (!dead) still = toDuotone(img)
        return
      }

      frames = new Array<HTMLImageElement | undefined>(count)
      // coarse frames first so scrubbing works while the rest are still downloading
      const seen = new Set<number>()
      const queue: number[] = []
      for (const stride of [16, 8, 4, 2, 1]) {
        for (let i = 0; i < count; i += stride) {
          if (!seen.has(i)) {
            seen.add(i)
            queue.push(i)
          }
        }
      }
      const worker = async () => {
        for (let i = queue.shift(); i !== undefined && !dead; i = queue.shift()) {
          try {
            frames[i] = await loadImage(`${dir}/f${pad(i + 1)}.webp`)
          } catch {
            /* a missing frame is skipped; the nearest loaded one is drawn instead */
          }
        }
      }
      await Promise.all(Array.from({ length: 6 }, worker))
    }

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    window.addEventListener('resize', resize)
    resize()
    void start()
    raf = requestAnimationFrame(tick)

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [progress])

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />
}
