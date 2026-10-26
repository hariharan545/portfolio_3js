import { useState, type FormEvent } from 'react'
import { profile } from '../data/content'

const YEAR = new Date().getFullYear()
// empty in dev (Vite proxies /api); set VITE_API_URL to your deployed API when you publish the site
const API = import.meta.env.VITE_API_URL ?? ''

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'ok' } | { kind: 'error'; message: string }

export default function Contact() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    setStatus({ kind: 'sending' })
    setFieldErrors({})

    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'),
          email: f.get('email'),
          message: f.get('message'),
          website: f.get('website'), // honeypot, stays empty for real visitors
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: Record<string, string> }
      if (res.ok && data.ok) {
        form.reset()
        setStatus({ kind: 'ok' })
        return
      }
      if (data.errors) setFieldErrors(data.errors)
      setStatus({ kind: 'error', message: data.error ?? 'Please check the highlighted fields.' })
    } catch {
      setStatus({ kind: 'error', message: `Could not reach the server. Please email me at ${profile.email}.` })
    }
  }

  const sending = status.kind === 'sending'

  return (
    <section id="contact" className="relative px-5 pb-6 pt-28">
      <p className="eyebrow text-center">Contact</p>
      <h2 className="font-display mt-2 text-center text-5xl leading-[1] sm:text-7xl">
        Let's work
        <br />
        <span className="serif text-[color:var(--accent)]">together</span>
        <span className="text-[color:var(--accent)]">.</span>
      </h2>

      <div className="mx-auto mt-12 grid max-w-5xl items-center gap-8 md:grid-cols-[1fr_1fr]">
        <form onSubmit={onSubmit} noValidate className="surface rounded-2xl p-6">
          <h3 className="font-display text-2xl">Contact Form</h3>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            Please contact me directly at <b className="text-[color:var(--fg)]">{profile.email}</b> or drop your info
            here.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold">
              Full name
              <input name="name" required maxLength={100} placeholder="Your Name" className="field mt-1.5" />
              {fieldErrors.name && <span className="mt-1 block font-normal text-[color:var(--accent)]">{fieldErrors.name}</span>}
            </label>
            <label className="text-xs font-bold">
              Email Address
              <input name="email" type="email" required maxLength={200} placeholder="you@example.com" className="field mt-1.5" />
              {fieldErrors.email && <span className="mt-1 block font-normal text-[color:var(--accent)]">{fieldErrors.email}</span>}
            </label>
          </div>
          <label className="mt-4 block text-xs font-bold">
            Your Message
            <textarea
              name="message"
              required
              rows={4}
              maxLength={3000}
              placeholder="Tell me about your project..."
              className="field mt-1.5 resize-none"
            />
            {fieldErrors.message && <span className="mt-1 block font-normal text-[color:var(--accent)]">{fieldErrors.message}</span>}
          </label>

          {/* honeypot: hidden from people, bots tend to fill it */}
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <p className="mt-2 text-[11px] text-[color:var(--muted)]">I'll never share your data with anyone else.</p>
          <button
            type="submit"
            disabled={sending}
            className="mt-4 w-full rounded-lg bg-[color:var(--accent)] py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send Message  ›'}
          </button>

          <div role="status" aria-live="polite" className="mt-3 min-h-5 text-xs">
            {status.kind === 'ok' && (
              <p className="font-semibold text-emerald-400">Thanks! Your message is in my inbox. I'll reply soon.</p>
            )}
            {status.kind === 'error' && <p className="font-semibold text-[color:var(--accent)]">{status.message}</p>}
          </div>
        </form>

        {/* the shared 3D keyboard sits here, drawn behind the page */}
        <div aria-hidden className="hidden h-[420px] md:block" />
      </div>

      <footer className="mx-auto mt-16 flex max-w-5xl items-center justify-between border-t border-[color:var(--card-border)] pt-5 text-xs text-[color:var(--muted)]">
        <span>
          © {YEAR} {profile.fullName}. All rights reserved.
        </span>
        <span className="flex gap-4 font-semibold text-[color:var(--fg)]">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </span>
      </footer>
    </section>
  )
}
