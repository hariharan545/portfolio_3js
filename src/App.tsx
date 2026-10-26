import { lazy, Suspense, useEffect, useState } from 'react'
import Backdrop from './components/Backdrop'
import Contact from './components/Contact'
import Faq from './components/Faq'
import Hero from './components/Hero'
import Mascot from './components/Mascot'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import Projects from './components/Projects'
import Services from './components/Services'
import TechStack from './components/TechStack'
import { useActiveSection } from './hooks/useActiveSection'
import { initLenis } from './lib/lenis'
import type { TechKey } from './data/techKeys'

// three.js is heavy, so the keyboard loads after the first paint
const KeyboardStage = lazy(() => import('./components/KeyboardStage'))

export default function App() {
  const section = useActiveSection()
  const [activeKey, setActiveKey] = useState<TechKey | null>(null)

  useEffect(() => {
    initLenis()
  }, [])

  // keep the URL hash in step with the section, like a multi-page site would
  useEffect(() => {
    history.replaceState(null, '', section === 'home' ? window.location.pathname : `#${section}`)
  }, [section])

  return (
    <>
      <Preloader />
      <Backdrop />
      <Suspense fallback={null}>
        <KeyboardStage section={section} onActiveChange={setActiveKey} />
      </Suspense>
      <Mascot />
      <Navbar active={section} />
      <main className="relative z-10">
        <Hero />
        <TechStack active={activeKey} />
        <Projects />
        <Services />
        <Faq />
        <Contact />
      </main>
    </>
  )
}
