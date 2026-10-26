import { useEffect, useState } from 'react'

/** Types each phrase out, pauses, deletes it and moves to the next, with a blinking cursor. */
export default function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index % words.length]
    let delay = deleting ? 35 : 75
    if (!deleting && text === word) delay = 1500
    if (deleting && text === '') delay = 350

    const id = window.setTimeout(() => {
      if (!deleting && text === word) setDeleting(true)
      else if (deleting && text === '') {
        setDeleting(false)
        setIndex((i) => (i + 1) % words.length)
      } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
    }, delay)
    return () => window.clearTimeout(id)
  }, [text, deleting, index, words])

  return (
    <span>
      {text}
      <span aria-hidden className="caret ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-white align-baseline" />
    </span>
  )
}
