import { animate, onScroll } from 'animejs'
import { type RefObject, useEffect, useRef } from 'react'
import { contentViewportID, Section } from '~/lib/consts'
import { clamp } from '~/lib/utils'

type ConnectorProps = {
  sectionsContainerRef: RefObject<HTMLDivElement | null>
}

/** Component displaying dynamically positioned lines connecting nav items with their corresponding content sections */
export function Connector({ sectionsContainerRef }: ConnectorProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    const sectionsContainer = sectionsContainerRef.current
    const svgElement = container?.querySelector('svg')

    if (!container || !sectionsContainer || !svgElement) {
      return
    }

    const items = document
      .querySelectorAll('a[data-slot="navigation-item"]' as 'a')
      .entries()
      .reduce(
        (acc, [_, navItem]) => {
          const targetKey = navItem.getAttribute('href')?.replace(/^#/, '')
          if (!targetKey || Object.values(Section).includes(targetKey as Section)) {
            return acc
          }

          const section = document.getElementById(targetKey)
          if (section) {
            acc.push({
              navItem,
              section,
              sectionIndex: Number(navItem.dataset.sectionIndex),
              pathElement: null,
            })
          }
          return acc
        },
        [] as Array<{
          navItem: HTMLAnchorElement
          section: HTMLElement
          sectionIndex: number
          pathElement: SVGPathElement | null
        }>,
      )

    const updateSvg = () => {
      for (const item of items) {
        if (!item.pathElement) {
          item.pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          item.pathElement.setAttribute(
            'stroke',
            `oklch(var(--foreground-tetradic-${item.sectionIndex}))`,
          )
          svgElement.appendChild(item.pathElement)
        }

        const navItemRect = item.navItem.getBoundingClientRect()
        const sectionRect = item.section.getBoundingClientRect()

        // M 49,0 C 49,100 17,0 17,100
        const padding = 16 * 8 // 8 rem
        const navItemCenterY = navItemRect.top + navItemRect.height / 2
        const sectionClosestY = clamp(
          navItemCenterY,
          sectionRect.top + padding,
          sectionRect.bottom - padding,
        )

        const d = `M ${0},${navItemCenterY} C ${svgElement.clientWidth / 2},${navItemCenterY} ${svgElement.clientWidth / 2},${sectionClosestY} ${svgElement.clientWidth},${sectionClosestY}`
        item.pathElement.setAttribute('d', d)

        const outsideDistance =
          sectionClosestY < 0
            ? -sectionClosestY
            : sectionClosestY > svgElement.clientHeight
              ? sectionClosestY - svgElement.clientHeight
              : 0
        item.pathElement.style.opacity = clamp(
          1 - outsideDistance / svgElement.clientHeight,
          0.2,
          1,
        ).toString()
      }
    }
    updateSvg()

    let lastProgress = -1

    const sidebarAnimation = animate(container, {
      ease: 'linear',
      autoplay: onScroll({
        container: `#${contentViewportID} [data-radix-scroll-area-viewport]`,
        target: sectionsContainer,
        enter: { target: 'top', container: 'center' },
        leave: { target: 'bottom', container: 'center' },
        sync: 1,
        onUpdate: (observer) => {
          if (observer.progress === lastProgress) {
            return
          }

          updateSvg()
          lastProgress = observer.progress
        },
        // debug: import.meta.env.DEV
      }),
    })

    const resizeObserver = new ResizeObserver(() => {
      svgElement.setAttribute('viewBox', `0 0 ${container.clientWidth} ${container.clientHeight}`)
    })

    resizeObserver.observe(container)

    return () => {
      svgElement.innerHTML = ''
      sidebarAnimation.revert()
      resizeObserver.disconnect()
    }
  }, [sectionsContainerRef])

  return (
    <div ref={ref} data-slot="sidebar-connector" className="h-full w-full max-w-64 grow">
      <svg
        className="size-full stroke-foreground"
        viewBox="0 0 100 100"
        strokeWidth={0.5}
        // strokeDasharray="4 4"
        fill="none"
      />
    </div>
  )
}
