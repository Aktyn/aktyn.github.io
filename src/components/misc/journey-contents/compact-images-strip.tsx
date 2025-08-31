import { Suspense } from "react"
import { ImagesStrip } from "~/components/gallery/images-strip"
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"
import { Skeleton } from "~/components/ui/skeleton"
import { cn } from "~/lib/utils"

type CompactImagesStripProps = {
  images: string[]
  altPrefix: string
  className?: string
}

export function CompactImagesStrip({
  images,
  altPrefix,
  className,
}: CompactImagesStripProps) {
  return (
    <ScrollArea
      className={cn(
        "-m-4 -my-16 h-64 **:data-[slot=scroll-area-viewport]:*:max-h-full",
        className,
      )}
    >
      <div className="overflow-hidden min-w-full flex flex-row justify-start items-stretch gap-4 p-4 pt-16 mx-auto *:h-32 *:*:h-32! **:[img]:w-auto **:[img]:max-w-fit **:[img]:first:blur-md">
        <Suspense
          fallback={
            <div className="flex flex-row gap-4">
              <Skeleton className="w-52 h-32" />
              <Skeleton className="w-52 h-32" />
              <Skeleton className="w-52 h-32" />
              <Skeleton className="w-52 h-32" />
              <Skeleton className="w-52 h-32" />
            </div>
          }
        >
          <ImagesStrip
            images={images}
            altPrefix={altPrefix}
            ambientOpacity={0.3}
          />
        </Suspense>
      </div>
      <ScrollBar orientation="horizontal" className="mb-12" />
    </ScrollArea>
  )
}
