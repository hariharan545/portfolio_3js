import { Fragment } from 'react'

/** Renders "plain *emphasised* text" with the emphasised words in the serif italic accent style. */
export default function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <em key={i} className="serif font-normal text-white">
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
