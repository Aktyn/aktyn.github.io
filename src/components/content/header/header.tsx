import { createDraggable, createScope, spring } from 'animejs'
import {
  type ComponentProps,
  type RefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { WebGlSwitch } from '~/components/controls/webgl-switch'
import { isWebglAvailable } from '~/graphics/graphics-helpers'
import { materialSymbolIcons, materialSymbolProps } from '~/icons/material-symbol-icons'
import { LOGO_PATH, mainHeaderID } from '~/lib/consts'
import { cn } from '~/lib/utils'
import type { ProjectedComponentRef } from '../content-helpers'
import { ProjectedIcon } from '../projected-elements/projected-icon'
import { ProjectedText } from '../projected-elements/projected-text'
import { PrintOptions } from './print-options'
import { LanguageSelect } from '~/components/controls/language-select'

export type HeaderInterfaceRef = {
  invalidateProjectedPositions: () => void
}

/** Semi sticky behavior */
export function Header({ ref: interfaceRef }: { ref: RefObject<HeaderInterfaceRef | null> }) {
  const ref = useRef<HTMLHeadElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const projectedLogoRef = useRef<ProjectedComponentRef>(null)
  const projectedPdfIconRef = useRef<ProjectedComponentRef>(null)
  const projectedPrintTextRef = useRef<ProjectedComponentRef>(null)
  const projectedCvTextRef = useRef<ProjectedComponentRef>(null)

  const webGLAvailable = useMemo(() => isWebglAvailable(), [])

  const { t } = useTranslation()

  const [showPrintOptions, setShowPrintOptions] = useState(false)

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

  useImperativeHandle(
    interfaceRef,
    () => ({
      invalidateProjectedPositions: () => {
        for (const projectedRef of [
          projectedLogoRef,
          projectedPdfIconRef,
          projectedPrintTextRef,
          projectedCvTextRef,
        ]) {
          projectedRef.current?.updatePosition?.()
        }
      },
    }),
    [],
  )

  return (
    <header
      ref={ref}
      data-id={mainHeaderID}
      className="pointer-events-none absolute top-0 bottom-auto z-10 -mb-header flex min-h-header w-full max-w-screen flex-row flex-wrap items-center justify-between p-2 delay-1000 *:pointer-events-auto print:hidden"
    >
      <HeaderSection data-entry-animation-type="from-left" className="mr-auto">
        <a
          aria-label="Logo Home Link"
          ref={logoRef}
          href={`#`}
          draggable={false}
          className="fill-current select-none"
        >
          <ProjectedIcon ref={projectedLogoRef} path={LOGO_PATH} size={32} lowPriority />
        </a>
        {webGLAvailable && <WebGlSwitch />}
      </HeaderSection>
      <HeaderSection className="relative ml-auto" data-entry-animation-type="from-right">
        <LanguageSelect />
        <button
          className="ml-auto flex cursor-pointer flex-row items-center gap-1.5 rounded-lg border border-foreground/20 px-2 py-1 text-foreground transition-colors hover:bg-foreground/20 *:[svg]:size-4"
          onClick={() => setShowPrintOptions((show) => !show)}
        >
          <ProjectedIcon
            ref={projectedPdfIconRef}
            path={materialSymbolIcons.PictureAsPdf}
            size={20}
            lowPriority
            {...materialSymbolProps}
          />
          <ProjectedText
            ref={projectedPrintTextRef}
            text={t('header.printOrDownload')}
            className="whitespace-nowrap"
            splitWords={false}
            fontSize={15}
            lowPriority
          />
          <ProjectedText
            ref={projectedCvTextRef}
            text={t('header.cv')}
            fontSize={15}
            fontWeight="bold"
            lowPriority
            title={t('header.cvTitle')}
          />
        </button>
        <PrintOptions
          showPrintOptions={showPrintOptions}
          setShowPrintOptions={setShowPrintOptions}
        />
      </HeaderSection>
    </header>
  )
}

function HeaderSection(props: ComponentProps<'div'>) {
  return <div {...props} className={cn('flex flex-row items-center gap-x-4', props.className)} />
}
