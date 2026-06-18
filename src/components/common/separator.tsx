import { type ComponentProps } from 'react'
import { cn } from '~/lib/utils'

type SeparatorProps = ComponentProps<'hr'> & {
  orientation?: 'horizontal' | 'vertical'
}

export function Separator({ orientation = 'horizontal', ...hrProps }: SeparatorProps) {
  return (
    <hr
      {...hrProps}
      className={cn(
        'border-none bg-border/40',
        orientation === 'horizontal' && 'h-px w-full',
        orientation === 'vertical' && 'h-full w-px',
        hrProps.className,
      )}
    />
  )
}
