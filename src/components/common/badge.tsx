import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'

export function Badge(props: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-md border border-foreground/50 bg-foreground/10 px-1 py-0.5 text-xs font-semibold',
        props.className,
      )}
    />
  )
}
