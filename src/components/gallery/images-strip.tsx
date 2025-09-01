import { useState } from "react"
import { RootPortal } from "../portal/root-portal"
import { AmbientImage } from "./ambient-image"
import { MaximizedGallery } from "./maximized-gallery"
import { cn } from "~/lib/utils"
import { isFirefox } from "~/lib/consts"

type ImagesStripProps = {
  images: string[]
  altPrefix: string
  ambientOpacity?: number
}

export function ImagesStrip({
  images,
  altPrefix,
  ambientOpacity,
}: ImagesStripProps) {
  const [openGallery, setOpenGallery] = useState(false)
  const [sourceBounds, setSourceBounds] = useState<DOMRect | null>(null)
  const [focusImageIndex, setFocusImageIndex] = useState(-1)

  return (
    <>
      {images.map((image, index) => (
        <AmbientImage
          key={image}
          src={image}
          alt={`${altPrefix}-${index}`}
          ambientOpacity={ambientOpacity}
          className={cn(
            "hover:scale-110 hover:z-10 transition-[scale] ease-bounce duration-bounce cursor-pointer *:duration-500 max-md:max-h-46",
            !isFirefox && "*:animate-in *:fade-in *:fill-mode-both",
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
