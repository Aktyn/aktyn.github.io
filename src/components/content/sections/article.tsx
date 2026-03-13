import { type ComponentProps } from 'react'
import { cn } from '~/lib/utils'

export function Article(props: ComponentProps<'article'>) {
  return (
    <article
      {...props}
      className={cn(
        'z-50 flex w-full max-w-7xl flex-col gap-3 overflow-hidden rounded-xl border-2 border-border/40 p-3 shadow-xl',
        'bg-linear-150 from-background/30 via-background/60 to-background/30 bg-repeat',
        props.className,
      )}
      //TODO: try to achieve a light reflection effect with fixed background attachment
      style={{
        background: 'linear-gradient(var(--tw-gradient-stops)), url(/img/noise.png)',
        backgroundRepeat: 'repeat',
        backgroundPosition: '0 0',
      }}
    />
  )
}
