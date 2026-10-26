import { useEffect, useState, type MouseEvent } from 'react'
import { profile } from '../data/content'
import { scrollToId } from '../lib/lenis'
import { isMuted, setMuted } from '../lib/sound'
import type { SectionId } from '../hooks/useActiveSection'

const links: { label: string; id: SectionId }[] = [
  { label: 'Home', id: 'home' },
  { label: 'Tech Stack', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Services', id: 'services' },
  { label: 'Contact', id: 'contact' },
]

type Theme = 'dark' | 'light'

export default function Navbar({ active }: { active: SectionId }) {
  const [muted, setMutedState] = useState(isMuted)
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('theme') as Theme) || 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage can be blocked */
    }
  }, [theme])

  const go = (e: MouseEvent, id: SectionId) => {
    e.preventDefault()
    scrollToId(id)
  }

  // "Hari" + "haran." : the last part picks up the accent colour, like the logo in the reference
  const cut = Math.ceil(profile.name.length / 2)

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-4 py-4 sm:px-8">
      <a href="#home" onClick={(e) => go(e, 'home')} className="font-display text-xl">
        {profile.name.slice(0, cut)}
        <span className="text-[color:var(--accent)]">{profile.name.slice(cut)}.</span>
      </a>

      <nav aria-label="Sections" className="no-scrollbar flex max-w-[52vw] items-center gap-1 overflow-x-auto sm:max-w-none sm:gap-3">
        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            onClick={(e) => go(e, l.id)}
            aria-current={active === l.id ? 'true' : undefined}
            className={`whitespace-nowrap border-b-2 px-2 py-1 text-xs font-semibold transition sm:px-3 sm:text-sm ${
              active === l.id
                ? 'border-[color:var(--accent)] text-[color:var(--fg)]'
                : 'border-transparent text-[color:var(--muted)] hover:text-[color:var(--fg)]'
            }`}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => {
            setMuted(!muted)
            setMutedState(!muted)
          }}
          aria-label={muted ? 'Turn key sounds on' : 'Turn key sounds off'}
          className="surface hidden h-9 w-9 place-items-center rounded-full text-sm lg:grid"
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <button
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          aria-label="Toggle theme"
          className="surface grid h-9 w-9 place-items-center rounded-full text-base"
        >
          {theme === 'dark' ? '☾' : '☀'}
        </button>
        <a
          href={profile.cvUrl}
          download
          className="hidden items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110 sm:flex"
        >
          <span aria-hidden>⭳</span> Download CV
        </a>
      </div>
    </header>
  )
}
