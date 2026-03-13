import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { type ComponentProps } from 'react'
import { cn } from '~/lib/utils'

type ScrollAreaProps = ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  orientation?: 'horizontal' | 'vertical'
  contentContainerProps?: ComponentProps<'div'>
}

export function ScrollArea({
  orientation = 'vertical',
  children,
  contentContainerProps = {},
  ...divProps
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      type="scroll"
      scrollHideDelay={2000}
      {...divProps}
      className={cn('inline-flex', divProps.className)}
    >
      <ScrollAreaPrimitive.Viewport
        {...contentContainerProps}
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
