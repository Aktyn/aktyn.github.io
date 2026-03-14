import { animate, onScroll } from 'animejs'
import { type ComponentPropsWithoutRef, type RefObject, useEffect, useRef } from 'react'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { contentViewportID, Section, sectionData } from '~/lib/consts'
import { cn } from '~/lib/utils'
import { ScrollArea } from '../common/scroll-area'
import { NavItem } from './nav-item'

type UpdateListener = () => unknown

//TODO: lines connecting section buttons with their corresponding containers

const sectionsArray = Object.values(Section).filter(
  (section) => section !== Section.Intro,
) as Array<Section>

type SidebarProps = ComponentPropsWithoutRef<'aside'> & {
  sectionsContainerRef: RefObject<HTMLDivElement | null>
}

export function Sidebar({ sectionsContainerRef, ...props }: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null)

  const updateListenersRef = useRef<Array<UpdateListener>>([])

  useEffect(() => {
    const sidebar = sidebarRef.current
    const sectionsContainer = sectionsContainerRef.current
    // const scrollableContainer = document.

    if (!sidebar || !sectionsContainer) {
      return
    }

    const sidebarAnimation = animate(sidebar, {
      translateX: ['-100%', '0%'],
      duration: 800,
      ease: 'inOutExpo',
      autoplay: onScroll({
        container: `#${contentViewportID} [data-radix-scroll-area-viewport]`,
        target: sectionsContainer,
        // Enters when the top of the target meets the bottom of the container
        // enter: { target: 'top', container: 'bottom' },
        // Leaves when the bottom of the target meets the top of the container
        // leave: { target: 'bottom', container: 'top' }
        enter: { target: 'top', container: 'center' },
        leave: { target: 'bottom', container: 'center' },
        sync: 'play reverse play reverse',
        onUpdate: () => updateListenersRef.current.forEach((listener) => listener()),
        // debug: import.meta.env.DEV,
      }),
    })

    return () => {
      sidebarAnimation.revert()
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
        'sticky top-0 flex h-screen flex-col items-start justify-start max-4xl:justify-self-start 4xl:items-end print:hidden',
        props.className,
      )}
    >
      <ScrollArea
        contentContainerProps={{ className: '*:px-4 *:py-8 *:flex! *:flex-col *:gap-y-4' }}
      >
        <NavItem
          section={Section.Intro}
          registerUpdateListener={registerUpdateListener}
          unregisterUpdateListener={unregisterUpdateListener}
        >
          <SvgIcon icon="VerticalAlignTop" />
          <span>Back to top</span>
        </NavItem>
        {sectionsArray.map((section) => (
          <NavItem
            key={section}
            section={section}
            registerUpdateListener={registerUpdateListener}
            unregisterUpdateListener={unregisterUpdateListener}
          >
            {sectionData[section].title}
          </NavItem>
        ))}
      </ScrollArea>
    </aside>
  )
}
