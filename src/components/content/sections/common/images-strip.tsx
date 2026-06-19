import { lazy, Suspense, useState } from 'react'
import { RootPortal } from '~/components/portal/root-portal'
import { AmbientImage } from '~/components/gallery/ambient-image'

const LazyMaximizedGallery = lazy(() => import('~/components/gallery/maximized-gallery'))

export type Images = Array<{ full: string; preview?: string }>

type ImagesStripProps = {
  images: Images
  altPrefix: string
  ambientOpacity?: number
}

export default function ImagesStrip({ images, altPrefix, ambientOpacity }: ImagesStripProps) {
  const [openGallery, setOpenGallery] = useState(false)
  const [sourceBounds, setSourceBounds] = useState<DOMRect | null>(null)
  const [focusImageIndex, setFocusImageIndex] = useState(-1)

  return (
    <>
      {images.map((image, index) => (
        <AmbientImage
          key={image.preview ?? image.full}
          src={image.preview ?? image.full}
          alt={`${altPrefix}-${index}`}
          ambientOpacity={ambientOpacity}
          className="
            cursor-pointer transition-[scale] ease-out
            hover:scale-110
            max-md:max-h-46
          "
          onClick={(event) => {
            setOpenGallery(true)
            setSourceBounds(event.currentTarget.getBoundingClientRect())
            setFocusImageIndex(index)
          }}
        />
      ))}
      {focusImageIndex !== -1 && (
        <RootPortal>
          <Suspense fallback={<span className="fixed inset-0">...</span>}>
            <LazyMaximizedGallery
              open={openGallery}
              onClose={() => setOpenGallery(false)}
              sourceBounds={sourceBounds}
              images={images.map((image) => image.full)}
              index={focusImageIndex}
              onIndexChange={setFocusImageIndex}
            />
          </Suspense>
        </RootPortal>
      )}
    </>
  )
}
