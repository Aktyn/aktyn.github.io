import { useEffect, useState, type FC } from 'react'
import clsx from 'clsx'
import { randomFloat } from 'utils/random'

import 'common-styles/animation.scss'
import './TypeInEffect.scss'

interface TypeInfEffectProps {
  children: string
  className: string
  duration?: number
  delay?: number
}

export const defaultTypeInEffectDuration = 1_000

export const TypeInEffect: FC<TypeInfEffectProps> = ({
  children,
  className,
  duration = defaultTypeInEffectDuration,
  delay = 0,
}) => {
  const [visibleChars, setVisibleChars] = useState<string[]>([])

  const averageCharDuration = duration / children.length

  useEffect(() => {
    setVisibleChars([])
    const individualChars = children.split('')

    const randomDelay = () => randomFloat(averageCharDuration * 0.5, averageCharDuration * 1.5)

    let timeout: number | null = null

    const pushChar = (char: string) => {
      setVisibleChars((prevChars) => [...prevChars, char])

      if (individualChars.length > 0) {
        timeout = setTimeout(pushChar, randomDelay(), individualChars.shift())
      } else {
        timeout = null
      }
    }

    timeout = setTimeout(pushChar, randomDelay() + delay, individualChars.shift())

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [averageCharDuration, children, delay])

  return (
    <div className={clsx(className, 'type-in-effect')}>
      <span className="placeholder">{children}</span>
      <div className="characters">
        {visibleChars.map((character, index) => (
          <span
            key={index}
            className="shrink-fade-side-in"
            style={{ display: character === ' ' ? 'inline' : 'inline-block' }}
          >
            {character}
          </span>
        ))}
      </div>
    </div>
  )
}
