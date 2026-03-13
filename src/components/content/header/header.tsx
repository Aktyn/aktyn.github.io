import { useEffect, useMemo, useRef } from 'react'
import { materialSymbolIcons, materialSymbolProps } from '~/icons/material-symbol-icons'
import { LOGO_PATH, mainHeaderID, Section } from '~/lib/consts'
import type { ProjectedComponentRef } from '../content-helpers'
import { ProjectedIcon } from '../projected-elements/projected-icon'
import { ProjectedText } from '../projected-elements/projected-text'
import { createDraggable, createScope, spring } from 'animejs'
import { isWebglAvailable } from '~/graphics/graphics-helpers'
import { WebGlSwitch } from './webgl-switch'

/** Semi sticky behavior */
export function Header() {
  const ref = useRef<HTMLHeadElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const projectedLogoRef = useRef<ProjectedComponentRef>(null)

  const webGLAvailable = useMemo(() => isWebglAvailable(), [])

  useEffect(() => {
    const scope = createScope({ root: ref }).add(() => {
      if (logoRef.current) {
        createDraggable(logoRef.current, {
          container: [0, 0, 0, 0],
          releaseEase: spring({ bounce: 0.7 }),
          onUpdate: () => projectedLogoRef.current?.updatePosition?.(),
          onSettle: () => projectedLogoRef.current?.updatePosition?.(),
        })
      }
    })

    return () => scope.revert()
  }, [])

  return (
    <header
      ref={ref}
      data-id={mainHeaderID}
      className="pointer-events-none absolute top-0 bottom-auto z-10 -mb-header flex min-h-header w-full max-w-screen flex-row flex-wrap items-center justify-between p-2 delay-1000 *:pointer-events-auto print:hidden"
      data-entry-animation-type="from-bottom"
    >
      <div className="flex flex-row items-center gap-x-4">
        <a
          ref={logoRef}
          href={`#${Section.Intro}`}
          draggable={false}
          className="fill-current select-none"
        >
          <ProjectedIcon ref={projectedLogoRef} path={LOGO_PATH} size={32} lowPriority />
        </a>
        {webGLAvailable && <WebGlSwitch />}
      </div>
      <button
        className="ml-auto flex cursor-pointer flex-row items-center gap-1.5 rounded-lg px-2 py-1 text-foreground transition-colors hover:bg-foreground/20 *:[svg]:size-4"
        onClick={() => window.print()}
      >
        <ProjectedIcon
          path={materialSymbolIcons.PictureAsPdf}
          size={20}
          lowPriority
          {...materialSymbolProps}
        />
        <ProjectedText
          text="Print or download"
          className="whitespace-nowrap"
          splitWords={false}
          fontSize={15}
          lowPriority
        />
        <ProjectedText
          text="CV"
          fontSize={15}
          fontWeight="bold"
          lowPriority
          title="Curriculum Vitae"
        />
      </button>
    </header>
  )
}
