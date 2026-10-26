import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { process, profile, services, type Service } from '../data/content'

function Detail({ s, onBack }: { s: Service; onBack: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onBack()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onBack])

  return (
    <motion.div
      data-lenis-prevent
      className="fixed inset-0 z-[65] overflow-y-auto overflow-x-hidden bg-[color:var(--bg)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[70vmin] w-[70vmin] rounded-full opacity-40 blur-3xl"
        style={{ background: s.hue }}
      />
      <div className="relative mx-auto grid min-h-screen max-w-5xl items-center gap-10 px-6 py-24 md:grid-cols-[1.2fr_1fr]">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <p className="text-sm font-semibold text-[color:var(--muted)]">My Services</p>
          <h3 className="mt-1 font-display text-4xl sm:text-5xl">{s.title}</h3>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[color:var(--fg)]/90">
            {s.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <button
            onClick={onBack}
            className="mt-8 rounded-full bg-[color:var(--accent)] px-6 py-2.5 text-sm font-bold text-black transition hover:scale-105"
          >
            ← BACK
          </button>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 14 }}
          className="grid aspect-square place-items-center rounded-[2.5rem]"
          style={{ background: `linear-gradient(145deg, ${s.hue}, transparent 90%)` }}
        >
          <span className="font-display text-[8rem] leading-none text-white/90">
            {String(services.indexOf(s) + 1).padStart(2, '0')}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const [open, setOpen] = useState<Service | null>(null)

  return (
    <section id="services" className="relative mx-auto max-w-6xl px-5 py-28">
      <div className="text-center">
        <p className="eyebrow">Services</p>
        <h2 className="font-display mt-2 text-5xl sm:text-7xl">
          What I <span className="serif text-[color:var(--accent)]">do</span>
          <span className="text-[color:var(--accent)]">.</span>
        </h2>
        <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">Pick a service to read more.</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {services.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => setOpen(s)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -6 }}
            className="surface group relative overflow-hidden rounded-3xl p-7 text-left"
          >
            <span
              aria-hidden
              className="absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-30 blur-2xl transition group-hover:opacity-60"
              style={{ background: s.hue }}
            />
            <span className="text-sm font-bold tracking-[0.2em] text-[color:var(--accent)]">0{i + 1}</span>
            <h3 className="font-display mt-2 text-2xl uppercase">{s.title}</h3>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{s.blurb}</p>
            <p className="mt-3 text-xs leading-relaxed text-[color:var(--muted)]">
              <span className="font-bold text-[color:var(--accent)]">Focus: </span>
              {s.focus}
            </p>
            <span className="mt-5 inline-block text-sm font-bold" style={{ color: s.hue }}>
              Read more →
            </span>
          </motion.button>
        ))}
      </div>

      <div className="mt-20">
        <p className="eyebrow text-center">How I work</p>
        <h3 className="font-display mt-2 text-center text-4xl sm:text-5xl">
          Process<span className="text-[color:var(--accent)]">.</span>
        </h3>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="surface rounded-2xl p-5"
            >
              <span className="text-sm font-bold tracking-[0.2em] text-[color:var(--accent)]">0{i + 1}</span>
              <h4 className="font-display mt-2 text-lg uppercase">{step.title}</h4>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="eyebrow">Certifications</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {profile.certifications.map((c) => (
            <span key={c} className="surface rounded-full px-4 py-2 text-xs text-[color:var(--muted)]">
              {c}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence>{open && <Detail key={open.id} s={open} onBack={() => setOpen(null)} />}</AnimatePresence>
    </section>
  )
}
