import { faq } from '../data/content'

export default function Faq() {
  return (
    <section id="faq" className="relative mx-auto max-w-3xl px-5 pt-24">
      <p className="eyebrow text-center">Questions</p>
      <h2 className="font-display mt-2 text-center text-4xl sm:text-6xl">
        FAQ<span className="text-[color:var(--accent)]">.</span>
      </h2>
      <div className="mt-10 divide-y divide-[color:var(--card-border)] border-y border-[color:var(--card-border)]">
        {faq.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold">
              {item.q}
              <span aria-hidden className="text-xl text-[color:var(--accent)] transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
