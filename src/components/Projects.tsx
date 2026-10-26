import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VanillaTilt from 'vanilla-tilt'
import { projects, type Project } from '../data/content'
import { techKeys } from '../data/techKeys'
import { useMediaQuery } from '../hooks/useMediaQuery'

const tiltOptions = { max: 5, speed: 400, glare: true, 'max-glare': 0.2, gyroscope: false }

function TechIcon({ name }: { name: string }) {
  const k = techKeys.find((t) => t.name === name)
  return (
    <span title={name} className="grid h-11 w-11 place-items-center text-xs font-bold">
      {k?.path ? (
        <svg viewBox="0 0 24 24" className="h-9 w-9 fill-white drop-shadow" aria-label={name}>
          <path d={k.path} />
        </svg>
      ) : (
        (k?.label ?? name.slice(0, 2))
      )}
    </span>
  )
}

/** The tilted "screenshot" in the corner. Uses a real image when the project has one. */
function Shot({ p }: { p: Project }) {
  return (
    <div className="absolute right-6 top-0 w-[12rem] -rotate-[22.5deg] overflow-hidden rounded-xl bg-white shadow-xl sm:w-[15rem] md:w-[17rem]">
      {p.image ? (
        <img src={p.image} alt={`${p.title} screenshot`} className="h-auto w-full object-contain" />
      ) : (
        <div className="p-4 text-neutral-900">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          </div>
          <p className="mt-4 font-display text-xl leading-tight">{p.caption}</p>
          <p className="mt-2 text-[11px] leading-snug text-neutral-600">{p.pitch}</p>
          <div className="mt-4 space-y-1.5">
            <div className="h-1.5 w-full rounded bg-neutral-200" />
            <div className="h-1.5 w-4/5 rounded bg-neutral-200" />
            <div className="h-1.5 w-3/5 rounded bg-neutral-200" />
          </div>
          <div className="mt-5 h-7 w-24 rounded-full" style={{ background: p.gradient[0] }} />
        </div>
      )}
    </div>
  )
}

function Detail({ p, onClose }: { p: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      data-lenis-prevent
      className="fixed inset-0 z-[65] overflow-y-auto overflow-x-hidden bg-[color:var(--bg)]/95 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-[70vmin] w-[70vmin] rounded-full opacity-40 blur-3xl"
        style={{ background: p.gradient[0] }}
      />
      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-24">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <p className="eyebrow">
            {p.org} · {p.period}
          </p>
          <h3 className="font-display mt-2 text-4xl sm:text-6xl">{p.title}</h3>
          <p className="mt-2 text-[color:var(--muted)]">{p.caption}</p>

          <h4 className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[color:var(--accent)]">What I did</h4>
          <ul className="mt-3 space-y-3 text-[15px] leading-relaxed">
            {p.bullets.map((b) => (
              <li key={b} className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="surface rounded-full px-3 py-1 text-xs font-semibold">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={onClose}
              className="rounded-full bg-[color:var(--accent)] px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
            >
              ← BACK
            </button>
            {p.link && (
              <a href={p.link} target="_blank" rel="noreferrer" className="text-sm font-semibold underline">
                Visit project ↗
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function Card({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const tilt = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = tilt.current
    if (!el) return
    VanillaTilt.init(el, tiltOptions)
    return () => (el as HTMLDivElement & { vanillaTilt?: { destroy(): void } }).vanillaTilt?.destroy()
  }, [])

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${p.title}`}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen()}
      className="block shrink-0 cursor-pointer snap-start overflow-hidden rounded-3xl"
      style={{ width: 'min(90vw, 38rem)', WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
    >
      <div
        ref={tilt}
        className="relative flex h-[20rem] flex-col justify-between overflow-hidden rounded-3xl p-6 text-white shadow-lg transition-transform duration-300 [transform-style:preserve-3d] [transform:perspective(1000px)] hover:-translate-y-2 sm:h-[22rem] md:h-[26rem]"
        style={{ background: `linear-gradient(90deg, ${p.gradient[0]} 0%, ${p.gradient[1]} 100%)` }}
      >
        <img
          src="/project-bg.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full rounded-3xl object-cover opacity-20"
        />
        <Shot p={p} />

        <h3 className="z-10 font-display text-xl sm:text-2xl" style={{ transform: 'translateZ(3rem)' }}>
          {p.title}
        </h3>

        {/* tech icons in a zig-zag column that follows the tilt of the screenshot */}
        <div
          className="absolute left-24 top-0 hidden h-full w-1/2 items-center sm:flex"
          style={{ transform: 'rotate(-22.5deg) translateZ(3rem)' }}
        >
          <div className="flex flex-col pb-8">
            {p.tags.map((t, i) => (
              <div key={t} className={`mb-4 ${i % 2 === 0 ? 'ml-16' : ''}`}>
                <TechIcon name={t} />
              </div>
            ))}
          </div>
        </div>

        <p className="z-10 max-w-[70%] text-sm tracking-wide" style={{ transform: 'translateZ(0.8rem)' }}>
          {p.caption}
        </p>
      </div>
    </div>
  )
}

export default function Projects() {
  const [open, setOpen] = useState<Project | null>(null)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // On desktop the section pins and the vertical scroll drives the row sideways.
  // On mobile the row is a normal swipeable strip.
  useLayoutEffect(() => {
    if (!isDesktop) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const pin = pinRef.current
      const track = trackRef.current
      if (!pin || !track) return
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, pinRef)
    return () => ctx.revert()
  }, [isDesktop])

  return (
    <section id="projects" className="relative">
      <div ref={pinRef} className="flex min-h-screen flex-col justify-center overflow-hidden py-24">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <p className="eyebrow">Selected work</p>
          <h2 className="font-display mt-2 text-5xl sm:text-7xl">
            Projects<span className="text-[color:var(--accent)]">.</span>
          </h2>
          <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">
            Quick hits from my {projects.length} build list.
          </p>
        </div>

        <div className="no-scrollbar mt-10 overflow-x-auto md:overflow-visible">
          <div ref={trackRef} className="flex w-max gap-8 px-5 pb-6 md:px-[8vw]">
            {projects.map((p) => (
              <Card key={p.title} p={p} onOpen={() => setOpen(p)} />
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>{open && <Detail key={open.title} p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  )
}
