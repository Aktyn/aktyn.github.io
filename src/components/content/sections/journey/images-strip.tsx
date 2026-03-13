import { useState } from 'react'
import { RootPortal } from '../../../portal/root-portal'
import { AmbientImage } from '../../../gallery/ambient-image'
import { MaximizedGallery } from '../../../gallery/maximized-gallery'
import { cn } from '~/lib/utils'
import { isFirefox } from '~/lib/consts'

type ImagesStripProps = {
  images: string[]
  altPrefix: string
  ambientOpacity?: number
}

export function ImagesStrip({ images, altPrefix, ambientOpacity }: ImagesStripProps) {
  const [openGallery, setOpenGallery] = useState(false)
  const [sourceBounds, setSourceBounds] = useState<DOMRect | null>(null)
  const [focusImageIndex, setFocusImageIndex] = useState(-1)
  //TODO: refine
  return (
    <>
      {images.map((image, index) => (
        <AmbientImage
          key={image}
          src={image}
          alt={`${altPrefix}-${index}`}
          ambientOpacity={ambientOpacity}
          className={cn(
            'cursor-pointer transition-[scale] duration-spring ease-spring *:duration-500 hover:z-10 hover:scale-110 max-md:max-h-46',
            !isFirefox && '*:animate-in *:fill-mode-both *:fade-in',
          )}
          onClick={(event) => {
            setOpenGallery(true)
            setSourceBounds(event.currentTarget.getBoundingClientRect())
            setFocusImageIndex(index)
          }}
        />
      ))}
      {focusImageIndex !== -1 && (
        <RootPortal>
          <MaximizedGallery
            open={openGallery}
            onClose={() => setOpenGallery(false)}
            sourceBounds={sourceBounds}
            images={images}
            index={focusImageIndex}
            onIndexChange={setFocusImageIndex}
          />
        </RootPortal>
      )}
    </>
  )
}
