import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/** A small blob with one eye that trails the cursor and looks where it is heading. */
export default function Mascot() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 110, damping: 16 })
  const sy = useSpring(y, { stiffness: 110, damping: 16 })
  const px = useTransform([x, sx], ([a, b]: number[]) => Math.max(-5, Math.min(5, (a - b) / 6)))
  const py = useTransform([y, sy], ([a, b]: number[]) => Math.max(-5, Math.min(5, (a - b) / 6)))

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX + 18)
      y.set(e.clientY + 18)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  return (
    <motion.div
      aria-hidden
      className="mascot pointer-events-none fixed left-0 top-0 z-[60] grid h-7 w-7 place-items-center rounded-full bg-[#f4f1e8] shadow-lg ring-2 ring-[color:var(--accent)]"
      style={{ x: sx, y: sy }}
    >
      <motion.span className="block h-2.5 w-2.5 rounded-full bg-neutral-900" style={{ x: px, y: py }} />
    </motion.div>
  )
}
