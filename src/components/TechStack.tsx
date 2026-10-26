import { AnimatePresence, motion } from 'framer-motion'
import type { TechKey } from '../data/techKeys'

/**
 * Only the heading and the hovered key's caption live here.
 * The keyboard itself is the shared one in KeyboardStage, so this section lets pointer events through.
 */
export default function TechStack({ active }: { active: TechKey | null }) {
  return (
    <section id="skills" className="pointer-events-none relative h-[170vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center px-4 pt-28 text-center">
        <p className="eyebrow">Skills</p>
        <h2 className="font-display mt-2 text-5xl sm:text-7xl">
          Tech Stack<span className="text-[color:var(--accent)]">.</span>
        </h2>
        <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">( hint: hover or press a key )</p>

        <div className="absolute left-[5%] top-[30%] w-[44%] text-left sm:left-[8%] sm:top-[32%]">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.name}
                initial={{ opacity: 0, y: 14, rotate: -22 }}
                animate={{ opacity: 1, y: 0, rotate: -22 }}
                exit={{ opacity: 0, y: -10, rotate: -22 }}
                transition={{ duration: 0.2 }}
                className="origin-left"
              >
                <p className="font-display text-3xl sm:text-5xl">{active.name}</p>
                <p className="mt-1 max-w-[14rem] text-xs text-[color:var(--muted)] sm:max-w-xs sm:text-sm">
                  {active.quip}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
