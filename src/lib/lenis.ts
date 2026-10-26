import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenis: Lenis | null = null

/** Smooth scrolling that stays in sync with GSAP ScrollTrigger (needed for the pinned project reel). */
export function initLenis() {
  if (lenis) return lenis
  gsap.registerPlugin(ScrollTrigger)
  const instance = new Lenis({ lerp: 0.1 })
  instance.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => instance.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  lenis = instance
  return instance
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
