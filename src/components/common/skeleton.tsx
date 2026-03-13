import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'

export function Skeleton(props: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'animate-pulse rounded-md bg-linear-120 from-foreground/10 via-foreground/15 to-foreground/10',
        props.className,
      )}
    />
  )
}
