import { animate, createScope, createTimeline, svg } from 'animejs'
import {
  useEffect,
  useRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type RefObject,
} from 'react'
import { useEntryAnimations } from '~/hooks/useEntryAnimations'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { Section, sectionData } from '~/lib/consts'
import { cn } from '~/lib/utils'
import { ProjectedText } from '../../projected-elements/projected-text'

import { useWindowSize } from '~/hooks/useWindowSize'
import './pulse.css'

const commonSvgProps: ComponentProps<'svg'> = {
  viewBox: '0 0 100 100',
  preserveAspectRatio: 'none',
  strokeWidth: 0.5,
  // strokeDasharray: "8 3",
  fill: 'none',
}

export function QuickAccess(props: ComponentPropsWithoutRef<'div'>) {
  const root = useRef<HTMLDivElement>(null)

  useSvgAnimations(root)

  return (
    <div
      ref={root}
      {...props}
      className={cn(
        'flex w-full max-w-screen flex-col items-center justify-start',
        // More pulse styles are located in pulse.css
        '**:[.pulse]:data-[index=0]:bg-foreground-tetradic-1',
        '**:[.pulse]:data-[index=1]:bg-foreground-tetradic-2',
        '**:[.pulse]:data-[index=2]:bg-foreground-tetradic-3',
        props.className,
      )}
    >
      {/* Zawartość strony */}
      <h5 data-entry-animation-type="zoom-in" className="text-sm font-medium text-muted-foreground">
        Site content
      </h5>

      <div
        className="relative hidden h-16 w-full not-print:lg:block"
        style={{
          maskImage: `linear-gradient(
              to bottom,
              #fff0,
              #ffff calc(var(--spacing)*4),
              #ffff calc(100% - var(--spacing)*4),
              #fff0
            )`,
        }}
      >
        <SvgBase>
          <path
            d="M 49,0 C 49,100 17,0 17,100"
            className="stroke-foreground-tetradic-1 fixed-stroke"
          />
          <path d="M 50,0 L 50,100" className="stroke-foreground-tetradic-2 fixed-stroke" />
          <path
            d="M 51,0 C 51,100 83,0 83,100"
            className="stroke-foreground-tetradic-3 fixed-stroke"
          />
        </SvgBase>
      </div>

      <div className="mt-4 grid max-w-384 grid-cols-1 justify-center gap-y-4 lg:mt-0 lg:grid-cols-3 lg:items-stretch">
        {Object.values(Section)
          .filter((section) => section !== Section.Intro)
          .map((section, index) => (
            <SectionLink
              key={section}
              section={section}
              className={cn(
                index === 0 &&
                  'text-[color-mix(in_oklch,var(--color-foreground-tetradic-1)_40%,var(--color-foreground))]',
                index === 1 &&
                  'text-[color-mix(in_oklch,var(--color-foreground-tetradic-2)_40%,var(--color-foreground))]',
                index === 2 &&
                  'text-[color-mix(in_oklch,var(--color-foreground-tetradic-3)_40%,var(--color-foreground))]',
              )}
            />
          ))}
      </div>

      <div
        className="relative hidden h-auto w-full grow animate-in delay-2000 duration-1000 fill-mode-both fade-in has-[[data-entry-animation-type]:not([data-entry-animation=entered])]:paused not-print:lg:block"
        style={{
          maskImage: `linear-gradient(
                to bottom,
                #fff0,
                #ffff calc(var(--spacing)*4),
                #fff0
              )`,
        }}
      >
        <SvgBase>
          <path
            d="M 17,0 C 17,50 33.5,50 33.5,100"
            className="stroke-foreground-tetradic-1 fixed-stroke"
          />
          <path d="M 50,0 L 50,100" className="stroke-foreground-tetradic-2 fixed-stroke" />
          <path
            d="M 83,0 C 83,50 66.5,50 66.5,100"
            className="stroke-foreground-tetradic-3 fixed-stroke"
          />
        </SvgBase>
      </div>
    </div>
  )
}

function SvgBase(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      data-type="svg-base"
      data-entry-animation-type="fade-in"
      {...commonSvgProps}
      {...props}
      className={cn(
        'absolute inset-0 size-full *:[line]:fixed *:[line]:fill-red-200',
        props.className,
      )}
      strokeDashoffset="100%"
    />
  )
}

function SectionLink({ section, className }: { section: Section; className?: string }) {
  return (
    <a
      href={`#${section}`}
      data-entry-animation
      className={cn(
        'relative inline-flex items-center justify-center rounded-xl p-2 hover:*:last:translate-y-0 hover:*:last:scale-100 hover:*:last:opacity-100 hover:*:first:*:[span]:text-foreground-complementary',
        className,
      )}
    >
      <div className="text-center font-semibold text-balance *:[span]:transition-colors">
        <ProjectedText
          text={sectionData[section].extendedTitle}
          as="span"
          fontSize={20}
          fontWeight="semibold"
        />
      </div>
      <div className="absolute inset-x-0 -bottom-5 flex -translate-y-5 scale-golden-inverse justify-center gap-x-1 text-sm font-normal text-foreground opacity-0 transition-[opacity,scale,translate]">
        <SvgIcon icon="WebTraffic" className="size-5" />
        <span>Click to go</span>
      </div>
    </a>
  )
}

function useSvgAnimations(root: RefObject<HTMLDivElement | null>) {
  const loadedRef = useRef(false)
  const size = useWindowSize()

  useEffect(() => {
    const mutationObservers: Array<MutationObserver> = []
    const pulseElements: Array<HTMLSpanElement> = []

    if (!size.width || !size.height) {
      return
    }

    const scope = createScope({ root }).add((self) => {
      const mainAttribute = useEntryAnimations.attributeNames[0] // data-entry-animation
      const svgElements = Array.from(
        self?.root?.querySelectorAll('svg[data-type="svg-base"]') ?? [],
      ).map((svg) => ({
        svg,
        ready: false,
      }))

      const setupAnimations = (svgElements: Element[]) => {
        const initialDelay = 1000

        const drawTimeline = createTimeline({
          delay: initialDelay, // Should not be lower than entry animation duration defined in main tailwind stylesheet (index.css)
        })
        const drawDuration = 1800

        const pulseTimeline = createTimeline({
          delay: loadedRef.current ? 0 : initialDelay + drawDuration,
          loop: true,
        })
        const singlePulseDuration = 3000

        for (let i = 0; i < svgElements.length; i++) {
          const svgElement = svgElements[i]
          const pathElements = svgElement.querySelectorAll('path')

          if (!loadedRef.current) {
            drawTimeline.sync(
              animate(svg.createDrawable(pathElements), {
                draw: ['0 0', '0 1'],
                ease: 'inOutQuad',
                duration: drawDuration,
              }),
              i * drawDuration,
            )
          }

          for (let j = 0; j < pathElements.length; j++) {
            const path = pathElements[j]
            const pulseElement = document.createElement('span')
            pulseElements.push(pulseElement)
            pulseElement.className = 'pulse'
            pulseElement.dataset.index = j.toString()
            svgElement.parentElement?.appendChild(pulseElement)

            const pulseAnimation = animate(pulseElement, {
              ease: 'linear',
              duration: singlePulseDuration,
              ...svg.createMotionPath(path),
              scale: [0.2, 1, 1, 0.618],
            })

            pulseTimeline.sync(pulseAnimation, 0)
          }
        }

        loadedRef.current = true
      }

      const onSvgReady = (svgElement: Element) => {
        const expectedSvg = svgElements.find((svg) => svg.svg === svgElement)
        if (expectedSvg) {
          expectedSvg.ready = true
        }

        if (svgElements.every((svg) => svg.ready)) {
          setupAnimations(svgElements.map((svg) => svg.svg))
        }
      }

      const callback: MutationCallback = (mutationList, observer) => {
        for (const mutation of mutationList) {
          if (
            mutation.attributeName === mainAttribute &&
            mutation.target instanceof SVGSVGElement &&
            mutation.target.getAttribute(mutation.attributeName) === useEntryAnimations.enteredValue
          ) {
            onSvgReady(mutation.target)
            observer.disconnect()
          }
        }
      }
      svgElements?.forEach(({ svg }) => {
        if (svg.getAttribute(mainAttribute) === useEntryAnimations.enteredValue) {
          onSvgReady(svg)
        } else {
          const observer = new MutationObserver(callback)
          observer.observe(svg, {
            attributes: true,
            attributeOldValue: false,
            attributeFilter: [mainAttribute],
          })
          mutationObservers.push(observer)
        }
      })
    })

    return () => {
      scope.revert()
      mutationObservers.forEach((observer) => observer.disconnect())
      pulseElements.forEach((pulseElement) => pulseElement.remove())
    }
  }, [root, size.height, size.width])
}
