import { animate, onScroll, stagger, svg } from 'animejs'
import { type ComponentPropsWithoutRef, type RefObject, useEffect, useRef } from 'react'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { contentViewportID, Section, sectionData } from '~/lib/consts'
import { cn } from '~/lib/utils'
import { ScrollArea } from '../common/scroll-area'
import { Connector } from './connector'
import { NavItem } from './nav-item'
import { useTranslation } from 'react-i18next'

type UpdateListener = () => unknown

const sectionsArray = Object.values(Section).filter(
  (section) => section !== Section.Intro,
) as Array<Section>

type SidebarProps = ComponentPropsWithoutRef<'aside'> & {
  sectionsContainerRef: RefObject<HTMLDivElement | null>
}

export function Sidebar({ sectionsContainerRef, ...props }: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null)
  const { t } = useTranslation()

  const updateListenersRef = useRef<Array<UpdateListener>>([])

  useEffect(() => {
    const sidebar = sidebarRef.current
    const connector = sidebar?.querySelector('[data-slot="sidebar-connector"]')
    const sectionsContainer = sectionsContainerRef.current

    if (!sidebar || !sectionsContainer || !connector || !(connector instanceof HTMLElement)) {
      return
    }

    const sidebarAnimation = animate(sidebar, {
      translateX: ['-100%', '0%'],
      duration: 800,
      ease: 'inOutExpo',
      autoplay: onScroll({
        container: `#${contentViewportID} [data-radix-scroll-area-viewport]`,
        target: sectionsContainer,
        enter: { target: 'top', container: 'center' },
        leave: { target: 'bottom', container: 'center' },
        sync: 'play reverse play reverse',
        onUpdate: () => {
          updateListenersRef.current.forEach((listener) => listener())
        },
        // debug: import.meta.env.DEV,
      }),
    })

    const pathElements = connector.querySelectorAll('path')
    const pathAnimation = animate(svg.createDrawable(pathElements), {
      draw: ['0 0', '0 1'],
      duration: 1000,
      delay: stagger(150),
      ease: 'inExpo',
      autoplay: onScroll({
        container: `#${contentViewportID} [data-radix-scroll-area-viewport]`,
        target: sectionsContainer,
        enter: { target: 'top', container: 'top+=8rem' },
        leave: { target: 'bottom', container: 'top-=8rem' },
        sync: 'play reverse play reverse',
        onUpdate: () => {
          updateListenersRef.current.forEach((listener) => listener())
        },
        // debug: import.meta.env.DEV,
      }),
    })

    return () => {
      sidebarAnimation.revert()
      pathAnimation.revert()
    }
  }, [sectionsContainerRef])

  const registerUpdateListener = (listener: UpdateListener) => {
    updateListenersRef.current.push(listener)
  }

  const unregisterUpdateListener = (listener: UpdateListener) => {
    updateListenersRef.current = updateListenersRef.current.filter((l) => l !== listener)
  }

  return (
    <aside
      ref={sidebarRef}
      {...props}
      className={cn(
        'sticky top-0 flex h-dvh w-full flex-row items-start justify-start overflow-hidden max-4xl:justify-self-start 4xl:justify-end print:hidden',
        props.className,
      )}
    >
      <ScrollArea
        className="max-h-full"
        contentContainerProps={{ className: '*:pl-4 *:py-8 *:flex! *:flex-col *:gap-y-4' }}
      >
        <NavItem
          section={Section.Intro}
          registerUpdateListener={registerUpdateListener}
          unregisterUpdateListener={unregisterUpdateListener}
        >
          <SvgIcon icon="VerticalAlignTop" />
          <span>{t('sidebar.backToTop')}</span>
        </NavItem>
        {sectionsArray.map((section) => (
          <NavItem
            key={section}
            section={section}
            registerUpdateListener={registerUpdateListener}
            unregisterUpdateListener={unregisterUpdateListener}
          >
            {t(`sections.${section}.title`, sectionData[section].title)}
          </NavItem>
        ))}
      </ScrollArea>
      <Connector sectionsContainerRef={sectionsContainerRef} />
    </aside>
  )
}
