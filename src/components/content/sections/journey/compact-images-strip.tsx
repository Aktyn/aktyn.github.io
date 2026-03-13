import { Suspense } from 'react'
import { ScrollArea } from '~/components/common/scroll-area'
import { Skeleton } from '~/components/common/skeleton'
import { ImagesStrip } from '~/components/content/sections/journey/images-strip'
import { cn } from '~/lib/utils'

type CompactImagesStripProps = {
  images: string[]
  altPrefix: string
  className?: string
}

export function CompactImagesStrip({ images, altPrefix, className }: CompactImagesStripProps) {
  return (
    <ScrollArea
      type="auto"
      orientation="horizontal"
      className={cn(
        '-m-4 -my-16 h-64 max-w-full **:data-radix-scroll-area-viewport:*:max-h-full',
        className,
      )}
    >
      <div className="mx-auto flex min-w-full flex-row items-stretch justify-start gap-4 overflow-hidden p-4 pt-16 *:*:h-32! *:h-32 **:[img]:w-auto **:[img]:max-w-fit **:[img]:first:blur-md">
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
