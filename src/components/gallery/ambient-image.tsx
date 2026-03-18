import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'

type AmbientImageProps = ComponentProps<'div'> & {
  src: string
  alt?: string
  ambientOpacity?: number
}

export function AmbientImage({ src, alt, ambientOpacity = 0.5, ...divProps }: AmbientImageProps) {
  return (
    <div
      {...divProps}
      className={cn('relative z-1 print:in-[.hide-images-in-print]:hidden', divProps.className)}
    >
      <img
        alt={`${alt}-blur`}
        src={src}
        loading="lazy"
        className="pointer-events-none absolute inset-0 -z-1 h-full scale-110 blur-lg print:hidden"
        style={{ opacity: ambientOpacity }}
      />
      <img
        alt={alt}
        src={src}
        loading="lazy"
        className="h-full max-w-fit rounded-md max-md:max-h-full md:h-auto md:w-full md:max-w-full"
      />
    </div>
  )
}
