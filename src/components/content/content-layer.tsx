import { animate, createScope, onScroll } from 'animejs'
import { useEffect, useRef } from 'react'
import { contentViewportID } from '~/lib/consts'
import { cn } from '~/lib/utils'
import { Header } from './header/header'
import { ProjectedButton } from './projected-button'
import { ProjectedText } from './projected-text'
import { type SceneProviderProps } from './scene-provider'
import { Intro } from './sections/intro/intro'

//TODO: about this site info (purpose, used technologies, etc)

export function ContentLayer({ webScene }: Pick<SceneProviderProps, 'webScene'>) {
  //TODO: test without webgl and adjust site appearance to non-webgl fallback
  // const webGLAvailable = useMemo(() => isWebglAvailable(), [])

  const root = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const introContainer = introRef.current
    if (!introContainer) {
      return
    }

    const scope = createScope({ root }).add((scope) => {
      animate('header:first-child', {
        y: ['0%', '-100%'],
        // ease: 'easeInOut',
        ease: 'linear',
        autoplay: onScroll({
          container: scope?.root,
          target: introContainer,
          // Enters when the top of the target meets the bottom of the container
          // enter: { target: 'top', container: 'bottom' },
          // Leaves when the bottom of the target meets the top of the container
          // leave: { target: 'bottom', container: 'top' }
          enter: { target: 'top-=4rem', container: 'top' },
          leave: { target: 'top', container: 'top' },
          // sync: 0.5,
          sync: 1,
          debug: import.meta.env.DEV,
        }),
      })
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

  return (
    <div
      ref={root}
      id={contentViewportID}
      className={cn(
        'pointer-events-auto absolute inset-0 no-scrollbar flex h-svh max-h-svh w-svw max-w-svw flex-col overflow-auto text-shadow-background/20 text-shadow-md print:**:[span]:text-[#001814] print:**:[svg]:fill-[#001814]',
        // 'text-foreground',
        // 'text-[#80CBC4]',
        // webGLAvailable && 'not-print:fill-transparent not-print:text-transparent',
      )}
    >
      <Header />

      <div className="flex min-h-screen flex-col items-center justify-center">
        <Intro ref={introRef} />
      </div>

      <p className="px-20 break-normal whitespace-break-spaces">
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
