import { type RefObject, useEffect } from 'react'

const STAGGER_DELAY = 200
/** Delay after refreshing the page in the same session */
const CONSEQUENTIAL_STAGGER_DELAY = 100
const entryAnimationAttributes = ['data-entry-animation', 'data-entry-animation-type']
const enteredAttributeValue = 'entered' as const

const currentSessionRefreshCount = parseInt(sessionStorage.getItem('site-refresh-count') ?? '0')
const delay = currentSessionRefreshCount > 0 ? CONSEQUENTIAL_STAGGER_DELAY : STAGGER_DELAY
sessionStorage.setItem('site-refresh-count', (currentSessionRefreshCount + 1).toString())

/**
 * Handles logic of toggling element attributes when they enter scroll area of given root container\
 * Animation styles are defined in main tailwind file: index.css\
 * To enable entry animation on an element set **data-entry-animation** attribute to **true** or **data-entry-animation-type** to any of the types supported by css rules\
 * Upon entering viewport, the attribute will have its value changed to "**entered**"\
 * This is one-way change. Leaving the viewport has no effect
 */
export function useEntryAnimations(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current?.parentElement
    if (!root) {
      return
    }

    const elementsQueue: Array<Element> = []
    let staggerTimeout: ReturnType<typeof setTimeout> | null = null
    let observer: IntersectionObserver | null = null

    const next = () => {
      if (staggerTimeout || !elementsQueue.length) {
        return
      }

      const currentElement = elementsQueue.sort(largestFirst).shift() // get largest element
      if (!currentElement) {
        return
      }

      currentElement?.setAttribute('data-entry-animation', 'entered')

      observer?.unobserve(currentElement)

      staggerTimeout = setTimeout(() => {
        staggerTimeout = null
        next()
      }, delay)
    }

    const enterElementStaggered = (element: Element) => {
      elementsQueue.push(element)
      next()
    }

    const onVisibilityChange: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (!(entry.target instanceof Element)) {
          continue
        }

        if (!entry.isIntersecting) {
          const index = elementsQueue.indexOf(entry.target)
          if (index > -1) {
            elementsQueue.splice(index, 1)
          }
        } else {
          enterElementStaggered(entry.target)
        }
      }
    }

    observer = new IntersectionObserver(onVisibilityChange, {
      root,
      threshold: 0.125,
    })

    // Initialize with small timeout to let the page perform initial scroll
    const timeout = setTimeout(() => {
      Array.from(
        root.querySelectorAll(entryAnimationAttributes.map((attr) => `[${attr}]`).join(',')),
      )
        .sort(largestFirst)
        .forEach((element) => {
          observer.observe(element)
        })
    }, 16)

    return () => {
      observer.disconnect()

      clearTimeout(timeout)
      if (staggerTimeout) {
        clearTimeout(staggerTimeout)
      }
    }
  }, [rootRef])
}

useEntryAnimations.attributeNames = entryAnimationAttributes
useEntryAnimations.enteredValue = enteredAttributeValue

/** Used in sort function for sorting elements from largest to smallest */
function largestFirst(a: Element, b: Element) {
  const aRect = a.getBoundingClientRect()
  const bRect = b.getBoundingClientRect()
  return bRect.width * bRect.height - aRect.width * aRect.height
}
