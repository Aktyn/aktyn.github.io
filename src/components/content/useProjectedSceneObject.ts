import { type RefObject, useContext, useEffect, useState } from 'react'
import { type SceneObject } from '~/graphics/scene-object'
import { type WebScene } from '~/graphics/web-scene'
import { contentViewportID } from '~/lib/consts'
import { getScrollableParent } from '~/lib/dom-utils'
import { assert } from '~/lib/utils'
import { SceneContext } from './scene-provider'

export function useProjectedSceneObject(
  elementRef: RefObject<Element | null>,
  /** Must be memoized */
  objectFactory: (webScene: WebScene) => Promise<SceneObject> | SceneObject,
) {
  const webScene = useContext(SceneContext)

  const [sceneObject, setSceneObject] = useState<SceneObject | null>(null)

  useEffect(() => {
    if (!elementRef.current) {
      return
    }
    assert(
      !!webScene,
      'Web scene is not available. Make sure to use this hook inside SceneProvider',
    )

    let sceneObject: SceneObject | null = null
    let mounted = true
    // let animationFrameId: number

    let factoryPromise = objectFactory(webScene)
    if (!(factoryPromise instanceof Promise)) {
      factoryPromise = Promise.resolve(factoryPromise)
    }

    let cleanup: ReturnType<typeof keepSceneObjectSynchronized> | null = null

    factoryPromise
      .then((object) => {
        if (!mounted) {
          object.dispose()
          return
        }
        sceneObject = object
        setSceneObject(object)

        if (elementRef.current) {
          cleanup = keepSceneObjectSynchronized(webScene, sceneObject, elementRef.current)
        }
      })
      .catch(console.error)

    return () => {
      mounted = false
      cleanup?.()
      if (sceneObject) {
        sceneObject.dispose()
      }
      setSceneObject(null)
    }
  }, [elementRef, objectFactory, webScene])

  return sceneObject
}

/**
 * - Updates scene object position upon certain events\
 * - Synchronizes scene object visibility with anchorElement visibility\
 * Returns cleanup function
 */
function keepSceneObjectSynchronized(
  webScene: WebScene,
  sceneObject: SceneObject,
  anchorElement: Element,
) {
  const updatePosition = () => {
    if (!sceneObject.isVisible()) {
      return
    }
    sceneObject.alignToElement(anchorElement, webScene.getCamera())
  }

  updatePosition()
  setTimeout(updatePosition, 500) // Temporary fix for svg sometimes being rendered after the position has been set

  window.addEventListener('resize', updatePosition)
  const scrollableContainers = getScrollableParent(anchorElement, true)
  scrollableContainers.forEach((container) => {
    container.addEventListener('scroll', updatePosition)
  })

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
    // trackVisibility: false,
    // delay: 100, //? Only if trackVisibility is true
  }

  const observer = new IntersectionObserver(onVisibilityChange, options)
  observer.observe(anchorElement)

  return () => {
    window.removeEventListener('resize', updatePosition)
    scrollableContainers.forEach((container) => {
      container.removeEventListener('scroll', updatePosition)
    })

    observer.unobserve(anchorElement)
  }
}
