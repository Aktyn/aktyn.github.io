import { Suspense } from 'react'
import { ImagesStrip } from '~/components/gallery/images-strip'
import { ScrollArea, ScrollBar, Skeleton } from '~/components/common/ui'
import { cn } from '~/lib/utils'

type CompactImagesStripProps = {
  images: string[]
  altPrefix: string
  className?: string
}

export function CompactImagesStrip({ images, altPrefix, className }: CompactImagesStripProps) {
  return (
    <ScrollArea
      className={cn('-m-4 -my-16 h-64 **:data-[slot=scroll-area-viewport]:*:max-h-full', className)}
    >
      <div className="mx-auto flex min-w-full flex-row items-stretch justify-start gap-4 overflow-hidden p-4 pt-16 *:*:h-32! *:h-32 **:[img]:w-auto **:[img]:max-w-fit **:[img]:first:blur-md">
        <Suspense
          fallback={
            <div className="flex flex-row gap-4">
              <Skeleton className="h-32 w-52" />
              <Skeleton className="h-32 w-52" />
              <Skeleton className="h-32 w-52" />
              <Skeleton className="h-32 w-52" />
              <Skeleton className="h-32 w-52" />
            </div>
          }
        >
          <ImagesStrip images={images} altPrefix={altPrefix} ambientOpacity={0.3} />
        </Suspense>
      </div>
      <ScrollBar orientation="horizontal" className="mb-12" />
    </ScrollArea>
  )
}
