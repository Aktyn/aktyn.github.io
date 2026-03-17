import { Suspense } from 'react'
import { ScrollArea } from '~/components/common/scroll-area'
import { Skeleton } from '~/components/common/skeleton'
import { ImagesStrip } from '~/components/content/sections/common/images-strip'
import { cn } from '~/lib/utils'

type CompactImagesStripProps = {
  images: string[]
  altPrefix: string
  maskSize?: number
  className?: string
}

export function CompactImagesStrip({
  images,
  altPrefix,
  maskSize = 4,
  className,
}: CompactImagesStripProps) {
  return (
    <ScrollArea
      type="auto"
      orientation="horizontal"
      className={cn(
        '-mx-3 not-print:contain-inline-size **:data-radix-scroll-area-viewport:-mt-16 **:data-radix-scroll-area-viewport:-mb-14 **:data-radix-scroll-area-viewport:*:max-h-full',
        className,
      )}
      contentContainerProps={{
        style: {
          maskImage: `linear-gradient(to right, transparent, black calc(var(--spacing)*${maskSize}), black calc(100% - var(--spacing)*${maskSize}), transparent)`,
        },
      }}
    >
      <div
        data-slot="images-strip-content-container"
        className="mx-auto flex min-w-full flex-row items-stretch justify-start gap-4 overflow-hidden px-3 py-16 *:*:h-32! *:h-32 **:[img]:w-auto **:[img]:max-w-fit **:[img]:first:blur-md"
      >
        <Suspense
          fallback={
            <div className="flex flex-row gap-4">
              {images.map((img, index) => (
                <Skeleton key={`${img}-${index}`} className="h-32 w-52" />
              ))}
            </div>
          }
        >
          <ImagesStrip images={images} altPrefix={altPrefix} ambientOpacity={0.4} />
        </Suspense>
      </div>
    </ScrollArea>
  )
}
