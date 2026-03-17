import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { type ComponentPropsWithRef, useEffect, useRef, type ComponentProps } from 'react'
import { cn } from '~/lib/utils'

type ScrollAreaProps = ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  orientation?: 'horizontal' | 'vertical'
  contentContainerProps?: ComponentPropsWithRef<'div'>
}

export function ScrollArea({
  orientation = 'vertical',
  children,
  contentContainerProps = {},
  ...divProps
}: ScrollAreaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollArea = ref.current
    const viewport = viewportRef.current

    if (orientation !== 'horizontal' || !scrollArea || !viewport) {
      return
    }

    const onWheel = (event: WheelEvent) => {
      viewport.scrollLeft += event.deltaY * 8
      event.preventDefault()
    }

    scrollArea.addEventListener('wheel', onWheel)

    return () => {
      scrollArea.removeEventListener('wheel', onWheel)
    }
  }, [orientation])

  return (
    <ScrollAreaPrimitive.Root
      type="scroll"
      scrollHideDelay={2000}
      {...divProps}
      ref={divProps.ref ?? ref}
      className={cn('inline-flex', divProps.className)}
    >
      <ScrollAreaPrimitive.Viewport
        {...contentContainerProps}
        ref={viewportRef}
        className={cn('scroll-smooth', contentContainerProps.className)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        orientation={orientation}
        forceMount
        className={cn(
          'opacity-0 transition-[translate,opacity] duration-400 data-[state=visible]:opacity-100 print:hidden',
          orientation === 'vertical' && 'translate-x-0 data-[state=hidden]:translate-x-full',
          orientation === 'horizontal' && 'translate-y-0 data-[state=hidden]:translate-y-full',
        )}
      >
        <ScrollAreaPrimitive.Thumb
          className={cn(
            'rounded-full bg-foreground/50 transition-colors hover:bg-foreground-complementary',
            orientation === 'vertical' &&
              '[--radix-scroll-area-thumb-width:calc(var(--spacing)*1.5)]',
            orientation === 'horizontal' &&
              '[--radix-scroll-area-thumb-height:calc(var(--spacing)*1.5)]',
          )}
        />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  )
}
