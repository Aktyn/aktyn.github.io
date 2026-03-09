import { useEffect, useRef } from 'react'
import { materialSymbolIcons, materialSymbolProps } from '~/icons/material-symbol-icons'
import { LOGO_PATH } from '~/lib/consts'
import type { ProjectedComponentRef } from '../content-helpers'
import { ProjectedIcon } from '../projected-elements/projected-icon'
import { ProjectedText } from '../projected-elements/projected-text'
import { createDraggable, createScope, spring } from 'animejs'

/** Semi sticky behavior */
export function Header() {
  const ref = useRef<HTMLHeadElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const projectedLogoRef = useRef<ProjectedComponentRef>(null)

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
      className="pointer-events-none sticky top-0 bottom-auto z-10 -mb-header flex min-h-header w-full max-w-screen flex-row items-center justify-between p-2 delay-1000 *:pointer-events-auto"
      data-entry-animation-type="from-bottom"
    >
      <div className="flex flex-row items-center gap-2">
        <div ref={logoRef}>
          <ProjectedIcon ref={projectedLogoRef} path={LOGO_PATH} size={32} lowPriority />
        </div>
      </div>
      <button
        className="flex cursor-pointer flex-row items-center gap-1.5 rounded-lg px-2 py-1 text-foreground transition-colors hover:bg-foreground/20 print:hidden *:[svg]:size-4"
        onClick={() => window.print()}
      >
        <ProjectedIcon
          path={materialSymbolIcons.PictureAsPdf}
          size={20}
          lowPriority
          {...materialSymbolProps}
        />
        <ProjectedText text="Print or download" splitWords={false} fontSize={15} lowPriority />
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
