import { type ComponentProps } from 'react'
import { Section } from '~/lib/consts'
import { cn } from '~/lib/utils'

type IntroProps = ComponentProps<'section'> & {
  ref: React.RefObject<HTMLDivElement | null>
}

export function Journey({ ref, className, ...props }: IntroProps) {
  return (
    <section
      ref={ref}
      id={Section.MyJourney}
      className={cn('flex flex-col items-center justify-center gap-y-8 text-center', className)}
      {...props}
    >
      <p className="p-10">TODO - journey section</p>
    </section>
  )
}
