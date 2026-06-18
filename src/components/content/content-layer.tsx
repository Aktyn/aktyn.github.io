import { animate, type JSAnimation, onScroll, stagger } from 'animejs'
import { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEntryAnimations } from '~/hooks/useEntryAnimations'
import { contentViewportID, mainHeaderID } from '~/lib/consts'
import { ScrollDownButton } from '../controls/scroll-down-button'
import { Header, type HeaderInterfaceRef } from './header/header'
import { SceneContext } from './scene-context'
import { Intro } from './sections/intro/intro'
import { Journey } from './sections/journey/journey'
import { isTouchDevice } from '~/lib/dom-utils'
import { ScrollArea } from '../common/scroll-area'
import { Projects } from './sections/projects/projects'
import { Sidebar } from '../navigation/sidebar'
import { TechStack } from './sections/tech-stack/tech-stack'
import { cn } from '~/lib/utils'
import { usePositionalColoring } from '~/hooks/usePositionalColoring'
import { Footer } from '../footer/footer'
import { HexBackground } from './hex-background'

export function ContentLayer() {
  const { t } = useTranslation()
  const root = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HeaderInterfaceRef>(null)
  const scrollDownButtonContainerRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement | null>(null)
  const journeyRef = useRef<HTMLDivElement | null>(null)
  const sectionsContainerRef = useRef<HTMLDivElement | null>(null)

  const [enableSmoothScrolling, setEnableSmoothScrolling] = useState(false)

  // Scroll linked animations
  useEffect(() => {
    const headerAnchor = introRef.current?.querySelector('[data-header-anchor]')
    const scrollableContainer =
      root.current?.querySelector('[data-radix-scroll-area-viewport]') ?? undefined
    if (!headerAnchor || !root.current || !scrollableContainer) {
      return
    }

    const animations: Array<JSAnimation> = []

    // Header auto-hide animation
    const headerAutoHideAnimation = animate(`header[data-id="${mainHeaderID}"] > *`, {
      translateX: ['0%', stagger(['-150%', '150%'])],
      ease: 'in',
      autoplay: onScroll({
        container: scrollableContainer,
        target: headerAnchor,
        // Enters when the top of the target meets the bottom of the container
        // enter: { target: 'top', container: 'bottom' },
        // Leaves when the bottom of the target meets the top of the container
        // leave: { target: 'bottom', container: 'top' }
        enter: { target: 'top-=8rem', container: 'top' },
        leave: { target: 'top', container: 'top' },
        sync: 0.5,
        onUpdate: () => headerRef.current?.invalidateProjectedPositions(),
        // debug: import.meta.env.DEV,
      }),
    })
    animations.push(headerAutoHideAnimation)

    if (scrollDownButtonContainerRef.current && journeyRef.current) {
      const scrollDownButtonContainer = scrollDownButtonContainerRef.current
      const scrollDownButtonAnimation = animate(scrollDownButtonContainer, {
        scale: [1, 0.618],
        opacity: [1, 0],
        ease: 'linear',
        autoplay: onScroll({
          container: scrollableContainer,
          target: journeyRef.current,
          enter: { target: 'top+=2rem', container: 'bottom' },
          leave: { target: 'top+=10rem', container: 'bottom' },
          sync: 0.5,
          onUpdate: (parameters) => {
            scrollDownButtonContainer.style.pointerEvents =
              parameters.progress < 0.4 ? 'all' : 'none'
          },
          // debug: import.meta.env.DEV,
        }),
      })
      animations.push(scrollDownButtonAnimation)
    }

    setEnableSmoothScrolling(true)

    return () => {
      animations.forEach((anim) => anim.revert())
    }
  }, [])

  const { webScene } = useContext(SceneContext)

  // WebGL pointer move handler (only on non-touch devices)
  useEffect(() => {
    if (!webScene || isTouchDevice()) {
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      webScene.onPointerMove(event.x, event.y)
    }

    window.addEventListener('pointermove', onPointerMove)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [webScene])

  useEntryAnimations(root)

  usePositionalColoring(root)

  return (
    <>
      {/* Main background colors gradient */}
      {webScene && (
        <div
          className="
            absolute inset-0 size-full bg-radial-[circle_at_50%_13%]
            from-[color-mix(in_oklch,var(--color-background-visual)_80%,var(--color-red-400))]
            to-[color-mix(in_oklch,var(--color-background-visual)_70%,var(--color-blue-600))]
            mix-blend-color
          "
        />
      )}
      <div
        ref={root}
        id={contentViewportID}
        className={cn(
          `
            prettier-plugin-tailwindcss pointer-events-auto absolute inset-0
            flex h-dvh max-h-dvh w-dvw max-w-dvw flex-col
            text-shadow-background/20 text-shadow-md
          `,
          !webScene &&
            `
              bg-transparent transition-[background-color] duration-700
              ease-linear
            `,
        )}
      >
        {!webScene && (
          <div
            className="
              absolute inset-0 size-full bg-radial-[circle_at_50%_13%]
              from-orange-100 via-orange-200/50 via-20% to-transparent to-70%
              opacity-40 mix-blend-plus-lighter
            "
          >
            <HexBackground />
          </div>
        )}

        <Header ref={headerRef} />
        <ScrollArea
          smoothScrolling={enableSmoothScrolling}
          className="flex size-full flex-col items-center"
          contentContainerProps={{
            className:
              'float-none w-full *:grid! max-3xl:*:grid-cols-1 min-7xl:*:grid-cols-1  *:grid-cols-[1fr_auto_1fr]',
            style: {
              maskImage: `linear-gradient(to bottom, 
                  #fff4,
                  #fffa calc(var(--spacing)*5),
                  #ffff calc(var(--spacing)*10),
                  #ffff calc(100% - var(--spacing)*10),
                  #fffa calc(100% - var(--spacing)*5),
                  #fff4
                )`,
            },
          }}
        >
          <Sidebar className="max-3xl:hidden" sectionsContainerRef={sectionsContainerRef} />

          <div className="mx-auto max-w-7xl">
            <div
              className="
                flex flex-col items-center justify-start
                *:min-h-dvh
              "
            >
              <Intro ref={introRef} />
            </div>

            <div
              ref={sectionsContainerRef}
              className="
                float-none inline-flex max-w-dvw flex-col items-stretch gap-16
                pb-8
              "
            >
              <Journey ref={journeyRef} />
              <Projects />
              <TechStack />
            </div>

            <Footer />
          </div>
        </ScrollArea>
      </div>

      <div
        className="
          pointer-events-none absolute inset-x-0 bottom-4 z-20 flex
          origin-bottom flex-row justify-center pt-48 text-center delay-2000
        "
        data-entry-animation-type="from-top"
      >
        <div ref={scrollDownButtonContainerRef} className="pointer-events-auto">
          <ScrollDownButton
            onClick={() =>
              journeyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }
          >
            {t('intro.scrollDown')}
          </ScrollDownButton>
        </div>
      </div>
    </>
  )
}
