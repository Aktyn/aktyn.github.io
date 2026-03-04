import { cn } from '~/lib/utils'
import type { ComponentProps } from 'react'
import { ChevronDown } from 'lucide-react'

export function ScreenEdgeButton({ children, className, ...divProps }: ComponentProps<'div'>) {
  return (
    <div
      {...divProps}
      className={cn(
        'view-transition-base ease-bounce hover:text-primary flex cursor-pointer flex-col items-center justify-self-center text-muted-foreground transition-[color,scale,opacity] *:animate-bounce *:animation-duration-2000 hover:scale-110',

        className,
      )}
    >
      <p className="text-xs font-medium">{children}</p>
      <ChevronDown className="size-4 delay-[-100ms]!" />
      <ChevronDown className="-mt-2 size-4 delay-[-300ms]!" />
    </div>
  )
}
