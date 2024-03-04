import { useEffect, useState, type FC } from 'react'

import 'common-styles/animation.scss'
import './TypeInEffect.scss'

export const TypeInEffect: FC<{ children: string; className: string }> = ({
  children,
  className,
}) => {
  const [visibleChars, setVisibleChars] = useState<string[]>([])
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setVisibleChars([])
    const individualChars = children.split('')

    const randomDelay = () => Math.floor(Math.random() * 100) + 50

    let timeout: number | null = null

    const pushChar = (char: string) => {
      setVisibleChars((prevChars) => [...prevChars, char])

      if (individualChars.length > 0) {
        timeout = setTimeout(pushChar, randomDelay(), individualChars.shift())
      } else {
        timeout = null
        setFinished(true)
      }
    }

    timeout = setTimeout(pushChar, randomDelay(), individualChars.shift())

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [children])

  return (
    <div
      className={className}
      style={{
        position: 'relative',
      }}
    >
      {visibleChars.map((character, index) => (
        <span
          key={index}
          className="shrink-in"
          style={{ display: character === ' ' ? 'inline' : 'inline-block' }}
        >
          {character}
        </span>
      ))}
      {/* TODO */}
      <div className="blinking-cursor" style={{ opacity: finished ? 0 : undefined }} />
    </div>
  )
}
