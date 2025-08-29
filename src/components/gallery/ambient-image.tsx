import type { ComponentProps } from "react"
import { cn } from "~/lib/utils"

type AmbientImageProps = ComponentProps<"div"> & {
  src: string
  alt?: string
  ambientOpacity?: number
}

export function AmbientImage({
  src,
  alt,
  ambientOpacity = 0.5,
  ...divProps
}: AmbientImageProps) {
  return (
    <div {...divProps} className={cn("relative", divProps.className)}>
      <img
        alt={`${alt}-blur`}
        src={src}
        loading="lazy"
        className="absolute inset-0 blur-lg scale-110 h-full -z-1 pointer-events-none"
        style={{ opacity: ambientOpacity }}
      />
      <img
        alt={alt}
        src={src}
        loading="lazy"
        className="md:w-full max-w-fit md:max-w-full h-full md:h-auto max-md:max-h-full rounded-md"
      />
    </div>
  )
}
