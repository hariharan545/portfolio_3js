/** Film grain plus a faint orange glow at the bottom of the page. Replaces the old starfield. */
export default function Backdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          opacity: 'var(--glow)',
          background:
            'radial-gradient(ellipse 60% 40% at 85% 100%, rgba(229,50,45,0.16), transparent 70%), radial-gradient(ellipse 50% 35% at 0% 0%, rgba(229,50,45,0.07), transparent 70%)',
        }}
      />
      <div aria-hidden className="grain" />
    </>
  )
}
