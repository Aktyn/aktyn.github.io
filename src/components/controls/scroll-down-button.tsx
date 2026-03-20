import type { ComponentProps } from 'react'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'

export function ScrollDownButton({ children, className, ...divProps }: ComponentProps<'div'>) {
  return (
    <div
      {...divProps}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-self-center text-muted-foreground transition-[color,scale,opacity] *:animate-bounce *:animation-duration-2000 hover:scale-110 hover:fill-foreground-complementary hover:text-foreground-complementary',

        className,
      )}
    >
      <p className="text-xs font-medium">{children}</p>
      <SvgIcon icon="ChevronDown" className="size-4 delay-[-100ms]!" />
      <SvgIcon icon="ChevronDown" className="-mt-2 size-4 delay-[-300ms]!" />
    </div>
  )
}
