import { type ComponentProps } from 'react'
import { cn } from '~/lib/utils'

export function Article(props: ComponentProps<'article'>) {
  return (
    <article
      {...props}
      className={cn(
        'relative flex w-full max-w-7xl flex-col gap-3 overflow-hidden rounded-xl border-border/40 p-3 not-print:border-2 not-print:shadow-xl',
        'bg-linear-150 from-background/30 via-background/60 to-background/30 bg-repeat print:bg-none!',
        props.className,
      )}
      style={{
        background: 'linear-gradient(var(--tw-gradient-stops)), url(/img/noise.png)',
        backgroundRepeat: 'repeat',
        backgroundPosition: '0 0',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_50%_38.2%] from-foreground-lighter/50 via-foreground-lighter/25 via-25% to-black/40 bg-fixed bg-center bg-no-repeat mix-blend-overlay print:hidden" />
      {props.children}
    </article>
  )
}
