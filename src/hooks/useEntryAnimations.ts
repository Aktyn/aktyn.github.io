import { type RefObject, useEffect } from 'react'

const STAGGER_DELAY = 150
const entryAnimationAttributes = ['data-entry-animation', 'data-entry-animation-type']
const enteredAttributeValue = 'entered' as const

/**
 * Handles logic of toggling element attributes when they enter scroll area of given root container\
 * Animation styles are defined in main tailwind file: index.css\
 * To enable entry animation on an element set **data-entry-animation** attribute to **true** or **data-entry-animation-type** to any of the types supported by css rules\
 * Upon entering viewport, the attribute will have its value changed to "**entered**"\
 * This is one-way change. Leaving the viewport has no effect
 */
export function useEntryAnimations(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!root.current) {
      return
    }

    const elementsQueue: Array<Element> = []
    let staggerTimeout: ReturnType<typeof setTimeout> | null = null

    const next = () => {
      if (staggerTimeout || !elementsQueue.length) {
        return
      }

      const currentElement = elementsQueue.shift()
      currentElement?.setAttribute('data-entry-animation', 'entered')

      staggerTimeout = setTimeout(() => {
        staggerTimeout = null
        next()
      }, STAGGER_DELAY)
    }

    const enterElementStaggered = (element: Element) => {
      elementsQueue.push(element)
      next()
    }

    const onVisibilityChange: IntersectionObserverCallback = (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue
        }

        if (entry.target instanceof HTMLElement) {
          enterElementStaggered(entry.target)
        }
        observer.unobserve(entry.target)
      }
    }
    const observer = new IntersectionObserver(onVisibilityChange, {
      root: root.current,
      threshold: 1,
    })

    Array.from(
      root.current.querySelectorAll(entryAnimationAttributes.map((attr) => `[${attr}]`).join(',')),
    )
      .sort(largestFirst)
      .forEach((element) => {
        observer.observe(element)
      })

    return () => {
      observer.disconnect()
      if (staggerTimeout) {
        clearTimeout(staggerTimeout)
      }
    }
  }, [root])
}

useEntryAnimations.attributeNames = entryAnimationAttributes
useEntryAnimations.enteredValue = enteredAttributeValue

/** Used in sort function for sorting elements from largest to smallest */
function largestFirst(a: Element, b: Element) {
  const aRect = a.getBoundingClientRect()
  const bRect = b.getBoundingClientRect()
  return bRect.width * bRect.height - aRect.width * aRect.height
}
