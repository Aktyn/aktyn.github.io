import { type ComponentProps } from 'react'
import { cn } from '~/lib/utils'

export function Separator(props: ComponentProps<'hr'>) {
  return (
    <hr
      {...props}
      className={cn('h-px w-full border-none bg-border/40 print:bg-background', props.className)}
    />
  )
}
