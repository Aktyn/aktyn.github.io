import { animate, onScroll } from 'animejs'
import { type RefObject, useContext, useEffect } from 'react'
import { SceneContext } from '~/components/content/scene-context'
import { contentViewportID, Section } from '~/lib/consts'
import { mix, mixColors } from '~/lib/utils'

/** Changes background colors to tetradic variant when scrolling between sections */
export function usePositionalColoring(targetRef: RefObject<HTMLDivElement | null>) {
  const { webScene } = useContext(SceneContext)

  useEffect(() => {
    const scrollableContainer =
      document.querySelector(`#${contentViewportID} [data-radix-scroll-area-viewport]`) ?? undefined
    const targetElement = targetRef.current

    if (!scrollableContainer || !targetElement) {
      return
    }

    const sectionsData = Object.values(Section).reduce(
      (acc, section, _, arr) => {
        const container = scrollableContainer.querySelector(`#${section}`)
        if (container && container instanceof HTMLElement) {
          acc.push({ section, sectionIndex: arr.indexOf(section), container })
        }
        return acc
      },
      [] as Array<{ section: Section; sectionIndex: number; container: HTMLElement }>,
    )

    const update = () => {
      const closestSections = sectionsData
        .map(({ sectionIndex, container }) => {
          const containerRect = container.getBoundingClientRect()
          const centerY = scrollableContainer.clientHeight / 2
          const distance = Math.max(0, containerRect.top - centerY, centerY - containerRect.bottom)

          return {
            sectionIndex,
            factor: Math.max(0, 1 - distance / (scrollableContainer.clientHeight / 4)),
            colorVar: [
              '--background-lighter',
              '--background-lighter-tetradic-1',
              '--background-lighter-tetradic-2',
              '--background-lighter-tetradic-3',
            ][sectionIndex],
            visualOklch: [
              [0.3853, 0.0347, 173.194] as const,
              [0.3263, 0.0458, 292.49] as const,
              [0.3429, 0.0398, 359.36] as const,
              [0.397, 0.0417, 117.2] as const,
            ][sectionIndex],
            webSceneBackground: [0x004d40, 0x19004d, 0x4d000d, 0x344d00][sectionIndex],
            webSceneSun: [0xe0f2f1, 0xe8e0f2, 0xf2e0e1, 0xeaf2e0][sectionIndex],
          }
        })
        .sort((a, b) => b.factor - a.factor)
        .slice(0, 2)

      if (webScene) {
        const mappedFactor =
          closestSections[1].factor / (closestSections[0].factor + closestSections[1].factor)
        const visualOklch = Array.from({ length: 3 }).map((_, i) =>
          mix(closestSections[0].visualOklch[i], closestSections[1].visualOklch[i], mappedFactor),
        )
        document.documentElement.style.setProperty(
          '--background-visual',
          `${visualOklch[0]} ${visualOklch[1]} ${normalizeHue(visualOklch[2])}`,
        )

        webScene.setBackgroundColor(
          mixColors(
            closestSections[0].webSceneBackground,
            closestSections[1].webSceneBackground,
            mappedFactor,
          ),
        )
        webScene.setSunColor(
          mixColors(closestSections[0].webSceneSun, closestSections[1].webSceneSun, mappedFactor),
        )
      } else {
        targetElement.style.backgroundColor = `color-mix(in oklch, oklch(var(${closestSections[0].colorVar})) ${closestSections[0].factor * 100}%, oklch(var(${closestSections[1].colorVar})) ${closestSections[1].factor * 100}%)`
      }
    }

    // Header auto-hide animation
    const animation = animate(scrollableContainer.children[0], {
      ease: 'linear',
      duration: 700,
      autoplay: onScroll({
        container: scrollableContainer,
        target: scrollableContainer.children[0],
        enter: { target: 'top', container: 'bottom' },
        leave: { target: 'bottom', container: 'top' },
        sync: true,
        onUpdate: (observer) => {
          if (observer.progress === observer.prevProgress || !targetRef.current) {
            return
          }

          update()
        },
        // debug: import.meta.env.DEV,
      }),
    })

    return () => {
      animation.revert()
      if (!webScene) {
        targetElement.style.backgroundColor = ''
      }
    }
  }, [targetRef, webScene])
}

function normalizeHue(hue: number) {
  while (hue < 0) {
    hue += 360
  }
  while (hue >= 360) {
    hue -= 360
  }
  return hue
}
