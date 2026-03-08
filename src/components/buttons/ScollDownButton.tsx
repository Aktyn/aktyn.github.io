import { cn } from '~/lib/utils'
import type { ComponentProps } from 'react'
import { materialSymbolIcons, materialSymbolProps } from '~/icons/material-symbol-icons'

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
      <ChevronDown className="size-4 delay-[-100ms]!" />
      <ChevronDown className="-mt-2 size-4 delay-[-300ms]!" />
    </div>
  )
}

function ChevronDown(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox={materialSymbolProps.viewBox} {...props}>
      <path d={materialSymbolIcons.ChevronDown} />
    </svg>
  )
}
