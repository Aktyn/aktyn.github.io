import { animate, createScope, onScroll, stagger } from 'animejs'
import { useEffect, useRef } from 'react'
import { useEntryAnimations } from '~/hooks/useEntryAnimations'
import { contentViewportID } from '~/lib/consts'
import { cn } from '~/lib/utils'
import { ScrollDownButton } from '../buttons/ScollDownButton'
import { Header } from './header/header'
import { ProjectedButton } from './projected-elements/projected-button'
import { ProjectedText } from './projected-elements/projected-text'
import { type SceneProviderProps } from './scene-provider'
import { Intro } from './sections/intro/intro'

//TODO: about this site info (purpose, used technologies, etc)

export function ContentLayer({ webScene }: Pick<SceneProviderProps, 'webScene'>) {
  //TODO: test without webgl and adjust site appearance to non-webgl fallback
  // const webGLAvailable = useMemo(() => isWebglAvailable(), [])

  const root = useRef<HTMLDivElement>(null)
  const scrollDownButtonContainerRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement | null>(null)
  const nextSectionRef = useRef<HTMLDivElement | null>(null) //TODO: adjust name

  useEffect(() => {
    const introContainer = introRef.current
    if (!introContainer) {
      return
    }

    const scope = createScope({ root }).add((scope) => {
      // Header auto-hide animation
      animate('header:first-child > *', {
        translateX: ['0%', stagger(['-150%', '150%'])],
        ease: 'easeIn',
        // ease: 'linear',
        autoplay: onScroll({
          container: scope?.root,
          target: introContainer,
          // Enters when the top of the target meets the bottom of the container
          // enter: { target: 'top', container: 'bottom' },
          // Leaves when the bottom of the target meets the top of the container
          // leave: { target: 'bottom', container: 'top' }
          enter: { target: 'top-=8rem', container: 'top' },
          leave: { target: 'top', container: 'top' },
          sync: 0.75,
          // sync: 1,
          debug: import.meta.env.DEV,
        }),
      })

      if (scrollDownButtonContainerRef.current && nextSectionRef.current) {
        const scrollDownButtonContainer = scrollDownButtonContainerRef.current
        animate(scrollDownButtonContainer, {
          scale: [1, 0.618],
          opacity: [1, 0],
          ease: 'easeIn',
          // ease: 'linear',
          autoplay: onScroll({
            container: scope?.root,
            target: nextSectionRef.current,
            enter: { target: 'top+=2rem', container: 'bottom' },
            leave: { target: 'top+=10rem', container: 'bottom' },
            sync: 0.75,
            onEnterBackward: () => {
              scrollDownButtonContainer.style.pointerEvents = 'all'
            },
            onEnterForward: () => {
              scrollDownButtonContainer.style.pointerEvents = 'none'
            },
            debug: import.meta.env.DEV,
          }),
        })
      }
    })

    const onPointerMove = (event: PointerEvent) => {
      webScene.onPointerMove(event.x, event.y)
    }

    window.addEventListener('pointermove', onPointerMove)

    return () => {
      scope.revert()
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [webScene])

  useEntryAnimations(root)

  return (
    <div
      ref={root}
      id={contentViewportID}
      className={cn(
        'pointer-events-auto absolute inset-0 no-scrollbar flex h-svh max-h-svh w-svw max-w-svw flex-col overflow-auto not-print:text-shadow-background/20 not-print:text-shadow-md print:**:[span]:text-[#001814] print:**:[svg]:fill-[#001814]',
        // webGLAvailable && 'not-print:fill-transparent not-print:text-transparent',
      )}
    >
      <Header />

      <div className="relative flex min-h-screen flex-col items-center justify-center">
        <Intro ref={introRef} />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex origin-bottom flex-row justify-center pt-48 text-center"
          data-entry-animation-type="from-bottom"
        >
          <div ref={scrollDownButtonContainerRef} className="pointer-events-auto">
            <ScrollDownButton
              onClick={() =>
                nextSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            >
              Scroll down for more
            </ScrollDownButton>
          </div>
        </div>
      </div>

      <p ref={nextSectionRef} className="px-20 break-normal whitespace-break-spaces">
        <ProjectedText text="Another text, multi word sentence" fontSize={84} fontWeight="light" />
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
    </div>
  )
}
