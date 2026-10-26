import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import FrameScrub from './FrameScrub'
import Rich from './Rich'
import Typewriter from './Typewriter'
import { profile } from '../data/content'
import { scrollToId } from '../lib/lenis'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // the character stays on screen for the whole hero, then fades so the keyboard can take over
  const stageOpacity = useTransform(scrollYProgress, [0, 0.88, 1], [1, 1, 0])
  const midOpacity = useTransform(scrollYProgress, [0.3, 0.42, 0.62, 0.74], [0, 1, 1, 0])
  const midY = useTransform(scrollYProgress, [0.3, 0.42, 0.62, 0.74], [40, 0, 0, -40])

  return (
    <section ref={ref} id="home" className="relative h-[380vh]">
      <motion.div style={{ opacity: stageOpacity }} className="sticky top-0 h-screen overflow-hidden bg-[#0a0607]">
        {/* dark red curves behind the character */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 45% 70% at 12% 40%, rgba(140,15,20,0.45), transparent 70%), radial-gradient(ellipse 40% 60% at 85% 20%, rgba(120,10,16,0.5), transparent 70%)',
          }}
        />
        <div
          aria-hidden
          className="absolute -left-[10%] top-[8%] h-[75vmin] w-[75vmin] rounded-full border border-[#e5322d]/10"
        />
        <div
          aria-hidden
          className="absolute right-[2%] top-[18%] h-[80vmin] w-[80vmin] rounded-full border border-[#e5322d]/10"
        />

        <FrameScrub progress={scrollYProgress} />

        {/* dark wash on the text side, so copy stays readable over the artwork */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(10,6,7,0.85) 0%, rgba(10,6,7,0.35) 55%, rgba(10,6,7,0) 100%), linear-gradient(0deg, #0a0607 0%, transparent 18%)',
          }}
        />
        <motion.p
          style={{ opacity: midOpacity, y: midY }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center font-display text-4xl leading-[1.05] sm:text-6xl"
        >
          {profile.heroLines[1]}
        </motion.p>
      </motion.div>

      {/* the intro copy scrolls away normally while the character keeps turning behind it */}
      <div className="absolute inset-x-0 top-0 h-screen px-6 sm:px-14 lg:px-24">
        <div className="flex h-full items-center pt-10">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl uppercase leading-[0.95] text-white sm:text-7xl lg:text-8xl">
              Hello I am
              <span className="mt-3 block min-h-[1.1em] normal-case text-[color:var(--accent)]">
                <Typewriter words={profile.roles} />
              </span>
            </h1>

            <div className="mt-6 max-w-lg space-y-3">
              <p className="text-base leading-snug text-white/90 sm:text-lg">
                <Rich text={profile.heroIntro[0]} />
              </p>
              {profile.heroIntro.slice(1).map((t) => (
                <p key={t} className="text-sm leading-relaxed text-white/60">
                  <Rich text={t} />
                </p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId('contact')
                }}
                className="rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-bold text-white transition hover:scale-105 hover:brightness-110"
              >
                Start Consulting
              </a>
              <span className="text-xs text-white/60">Based in {profile.location}</span>
            </div>
          </div>
        </div>

        {/* floating cards beside the character */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {profile.badges.map((b, i) => (
            <motion.div
              key={b.title}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute rounded-xl bg-white px-4 py-3 text-neutral-900 shadow-2xl"
              style={i === 0 ? { top: '24%', right: '9%' } : { bottom: '16%', right: '38%' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="font-display text-lg leading-none">{b.title}</p>
                  <p className="mt-1 text-[11px] text-neutral-500">{b.sub}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
