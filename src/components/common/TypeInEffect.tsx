import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  useEffect,
  useState,
  type FC,
  useRef,
} from 'react'
import clsx from 'clsx'
import { randomFloat } from 'utils/random'

import 'common-styles/animation.scss'
import './TypeInEffect.scss'

export interface TypeInfEffectProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'className' | 'children'
  > {
  children: string
  className?: string
  duration?: number
  delay?: number
  paused?: boolean
}

export const defaultTypeInEffectDuration = 1_000

export const TypeInEffect: FC<TypeInfEffectProps> = ({
  children,
  className,
  duration = defaultTypeInEffectDuration,
  delay = 0,
  paused,
  ...divProps
}) => {
  const individualCharsRef = useRef(children.split(''))

  const [visibleChars, setVisibleChars] = useState<string[]>([])

  const averageCharDuration = duration / children.length

  useEffect(() => {
    individualCharsRef.current = children.split('')
  }, [children])

  useEffect(() => {
    if (paused) {
      return
    }

    const randomDelay = () => randomFloat(averageCharDuration * 0.5, averageCharDuration * 1.5)

    let timeout: number | null = null

    const pushChar = (char: string) => {
      setVisibleChars((prevChars) => [...prevChars, char])

      if (individualCharsRef.current.length > 0) {
        timeout = setTimeout(pushChar, randomDelay(), individualCharsRef.current.shift())
      } else {
        timeout = null
      }
    }

    timeout = setTimeout(pushChar, randomDelay() + delay, individualCharsRef.current.shift())

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [averageCharDuration, children, delay, paused])

  return (
    <div {...divProps} className={clsx(className, 'type-in-effect')}>
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
