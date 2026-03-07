import { createDraggable, createScope, spring } from 'animejs'
import { useEffect, useRef } from 'react'
import { LOGO_PATH } from '~/lib/consts'
import type { ProjectedComponentRef } from '../content-helpers'
import { ProjectedIcon } from '../projected-elements/projected-icon'
import { materialSymbolIcons, materialSymbolProps } from '~/icons/material-symbol-icons'
import { ProjectedText } from '../projected-elements/projected-text'

/** Semi sticky behavior */
export function Header() {
  const ref = useRef<HTMLHeadElement>(null)
  const projectedLogoRef = useRef<ProjectedComponentRef>(null)

  useEffect(() => {
    const scope = createScope({ root: ref }).add(() => {
      createDraggable('[data-id="logo"]', {
        container: [0, 0, 0, 0],
        releaseEase: spring({ bounce: 0.7 }),
        onUpdate: () => projectedLogoRef.current?.updatePosition?.(),
        onSettle: () => projectedLogoRef.current?.updatePosition?.(),
      })
    })

    return () => scope.revert()
  }, [])

  return (
    <header
      ref={ref}
      className="sticky top-0 bottom-auto -mb-header flex min-h-header w-full flex-row items-center justify-between p-2"
    >
      <ProjectedIcon ref={projectedLogoRef} data-id="logo" path={LOGO_PATH} size={32} lowPriority />
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
