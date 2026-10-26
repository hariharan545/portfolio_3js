import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/** Short count-up intro that slides away to reveal the page. */
export default function Preloader() {
  const [n, setN] = useState(0)
  const [done, setDone] = useState(false)

  // driven by the clock, not by tick counts, so a busy first load can't stretch it out
  useEffect(() => {
    const start = performance.now()
    const id = window.setInterval(() => {
      const t = performance.now() - start
      setN(Math.min(100, Math.round(t / 12)))
      if (t >= 1450) {
        window.clearInterval(id)
        setDone(true)
      }
    }, 40)
    return () => window.clearInterval(id)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-[#0a0607] text-[color:var(--accent)]"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <span className="font-display text-7xl tabular-nums">{n}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
