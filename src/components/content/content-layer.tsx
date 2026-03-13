import { animate, type JSAnimation, onScroll, stagger } from 'animejs'
import { useContext, useEffect, useRef } from 'react'
import { useEntryAnimations } from '~/hooks/useEntryAnimations'
import { contentViewportID, mainHeaderID } from '~/lib/consts'
import { ScrollDownButton } from '../buttons/scroll-down-button'
import { Header } from './header/header'
import { ProjectedButton } from './projected-elements/projected-button'
import { ProjectedText } from './projected-elements/projected-text'
import { SceneContext } from './scene-context'
import { Intro } from './sections/intro/intro'
import { Journey } from './sections/journey/journey'
import { isTouchDevice } from '~/lib/dom-utils'
import { ScrollArea } from '../common/scroll-area'

//TODO: about this site info (purpose, used technologies, etc)

export function ContentLayer() {
  const root = useRef<HTMLDivElement>(null)
  const scrollDownButtonContainerRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement | null>(null)
  const journeyRef = useRef<HTMLDivElement | null>(null)

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

  return (
    <>
      {/* Main background colors gradient */}
      {webScene && (
        <div className="absolute inset-0 size-full bg-radial-[circle_at_50%_13%] from-[color-mix(in_oklch,var(--color-background-visual)_80%,var(--color-red-400))] to-[color-mix(in_oklch,var(--color-background-visual)_70%,var(--color-blue-600))] mix-blend-color print:hidden" />
      )}

      <Header />
      <div
        ref={root}
        id={contentViewportID}
        className="pointer-events-auto inset-0 flex w-dvw max-w-dvw flex-col not-print:absolute not-print:h-dvh not-print:max-h-dvh not-print:text-shadow-background/20 not-print:text-shadow-md"
      >
        <ScrollArea
          className="flex flex-col items-center not-print:size-full"
          contentContainerProps={{
            className: 'print:mask-none!',
            style: {
              maskImage:
                'linear-gradient(to bottom, #fff0, #fff calc(var(--spacing)*10), #fff calc(100% - var(--spacing)*10), #fff0)',
            },
          }}
        >
          <div className="flex flex-col items-center justify-start not-print:*:min-h-dvh">
            <Intro ref={introRef} />
          </div>

          {/* TODO: responsive navigation sidebar */}
          <Journey ref={journeyRef} className="not-print:pt-16" />

          <p className="px-20 break-normal whitespace-break-spaces">
            <ProjectedText
              text="Another text, multi word sentence"
              fontSize={84}
              fontWeight="light"
            />
          </p>
          <div className="flex flex-col items-center gap-16 text-center">
            <div>
              <ProjectedText text="Visibility test" fontSize={64} />
            </div>
            <div>
              <ProjectedButton text="Button test" fontSize={64} />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <ProjectedText text="X" fontSize={64} />
            <ProjectedText text="X" fontSize={64} />
            <ProjectedText text="X" fontSize={64} />
            <ProjectedText text="X" fontSize={64} />
            <ProjectedText text="X" fontSize={64} />
            <ProjectedText text="X" fontSize={64} />
            <ProjectedText text="X" fontSize={64} />
            <ProjectedText text="X" fontSize={64} />
          </div>
        </ScrollArea>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex origin-bottom flex-row justify-center pt-48 text-center delay-2000 print:hidden"
        data-entry-animation-type="from-top"
      >
        <div ref={scrollDownButtonContainerRef} className="pointer-events-auto">
          <ScrollDownButton
            onClick={() =>
              journeyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }
          >
            Scroll down for more
          </ScrollDownButton>
        </div>
      </div>
    </>
  )
}
