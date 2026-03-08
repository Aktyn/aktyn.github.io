import { type RefObject, useContext, useEffect, useState } from 'react'
import { type SceneObject } from '~/graphics/scene-object'
import { type WebScene } from '~/graphics/web-scene'
import { contentViewportID } from '~/lib/consts'
import { getEntryAnimatioParent, getScrollableParent } from '~/lib/dom-utils'
import { assert } from '~/lib/utils'
import { SceneContext } from './scene-provider'
import { useEntryAnimations } from '~/hooks/useEntryAnimations'

export function useProjectedSceneObject(
  elementRef: RefObject<Element | null>,
  /** Must be memoized */
  objectFactory: (webScene: WebScene) => Promise<SceneObject | null> | SceneObject | null,
) {
  const webScene = useContext(SceneContext)

  const [exposedValues, setExposedValues] = useState<{
    sceneObject: SceneObject
    updatePosition: () => void
  } | null>(null)

  useEffect(() => {
    const anchor = elementRef.current
    if (!anchor) {
      return
    }

    assert(
      !!webScene,
      'Web scene is not available. Make sure to use this hook inside SceneProvider',
    )

    let sceneObject: SceneObject | null = null
    let mounted = true

    let factoryPromise = objectFactory(webScene)
    if (!(factoryPromise instanceof Promise)) {
      factoryPromise = Promise.resolve(factoryPromise)
    }

    let cleanup: ReturnType<typeof keepSceneObjectSynchronized> | null = null

    factoryPromise
      .then((object) => {
        if (!object) {
          return
        }

        if (!mounted) {
          object.dispose()
          return
        }
        sceneObject = object

        const updatePosition = () => {
          if (!object.isVisible() || !mounted) {
            return
          }
          object.alignToElement(anchor, webScene.getCamera())
        }

        setExposedValues({ sceneObject: object, updatePosition })
        cleanup = keepSceneObjectSynchronized(sceneObject, anchor, updatePosition)
      })
      .catch(console.error)

    return () => {
      mounted = false
      cleanup?.()
      if (sceneObject) {
        sceneObject.dispose()
      }
      setExposedValues(null)
    }
  }, [elementRef, objectFactory, webScene])

  return exposedValues
}

/**
 * - Updates scene object position upon certain events\
 * - Synchronizes scene object visibility with anchorElement visibility\
 * Returns cleanup function
 */
function keepSceneObjectSynchronized(
  sceneObject: SceneObject,
  anchorElement: Element,
  updatePosition: () => void,
) {
  updatePosition()

  setTimeout(updatePosition, 500) // Temporary fix for svg sometimes being rendered after the position has been set

  const synchronizeWithAnimation = (duration: number) => {
    const endTime = performance.now() + duration
    const step: FrameRequestCallback = () => {
      updatePosition()
      if (performance.now() <= endTime) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }

  window.addEventListener('resize', updatePosition)
  const scrollableContainers = getScrollableParent(anchorElement, true)
  scrollableContainers.forEach((container) => {
    container.addEventListener('scroll', updatePosition)
  })

  const entryAnimationParent = getEntryAnimatioParent(anchorElement)
  let mutationObserver: MutationObserver | null = null

  if (entryAnimationParent) {
    const mainAttribute = useEntryAnimations.attributeNames[0] // data-entry-animation

    // First see if the object is already in "entered" state
    if (entryAnimationParent.getAttribute(mainAttribute) === useEntryAnimations.enteredValue) {
      // Duration must be a little larger than entry animation duration defined in main tailwind stylesheet (index.css)
      synchronizeWithAnimation(2000)
    }
    // Wait for data-entry-animation attribute to be set to "entered" on the parent element
    else {
      const callback: MutationCallback = (mutationList) => {
        for (const mutation of mutationList) {
          if (
            mutation.attributeName &&
            useEntryAnimations.attributeNames.includes(mutation.attributeName) &&
            mutation.target instanceof Element &&
            mutation.target.getAttribute(mutation.attributeName) === useEntryAnimations.enteredValue
          ) {
            // Duration must be a little larger than entry animation duration defined in main tailwind stylesheet (index.css)
            synchronizeWithAnimation(2000)
          }
        }
      }
      mutationObserver = new MutationObserver(callback)
      mutationObserver.observe(entryAnimationParent, {
        attributes: true,
        attributeOldValue: false,
        attributeFilter: [mainAttribute],
      })
    }
  }

  const onVisibilityChange: IntersectionObserverCallback = (entries) => {
    const anchor = entries.find((entry) => entry.target === anchorElement)
    if (!anchor) {
      return
    }
    sceneObject.setVisibility(anchor.isIntersecting)
    if (anchor.isIntersecting) {
      updatePosition()
    }
  }

  const options: IntersectionObserverInit = {
    root: document.querySelector(`#${contentViewportID}`),
    threshold: 0,
  }

  const intersectionObserver = new IntersectionObserver(onVisibilityChange, options)
  intersectionObserver.observe(anchorElement)

  return () => {
    window.removeEventListener('resize', updatePosition)
    scrollableContainers.forEach((container) => {
      container.removeEventListener('scroll', updatePosition)
    })

    intersectionObserver.unobserve(anchorElement)
    mutationObserver?.disconnect()
  }
}
