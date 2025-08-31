import { useState } from "react"
import { AmbientImage } from "~/components/gallery/ambient-image"
import { MaximizedGallery } from "~/components/gallery/maximized-gallery"
import { RootPortal } from "~/components/portal/root-portal"
import { journeyInfo, JourneySection } from "~/lib/journey-info"

export function Diploma() {
  const [openGallery, setOpenGallery] = useState(false)
  const [sourceBounds, setSourceBounds] = useState<DOMRect | null>(null)

  const diplomaSrc = journeyInfo[JourneySection.Education].images[0]

  return (
    <>
      <AmbientImage
        src={diplomaSrc}
        alt="diploma"
        className="hover:scale-110 hover:z-10 transition-[scale] ease-bounce duration-bounce cursor-pointer h-48 *:max-h-48"
        ambientOpacity={0.3}
        onClick={(event) => {
          setOpenGallery(true)
          setSourceBounds(event.currentTarget.getBoundingClientRect())
        }}
      />
      <RootPortal>
        <MaximizedGallery
          open={openGallery}
          onClose={() => setOpenGallery(false)}
          sourceBounds={sourceBounds}
          images={[diplomaSrc]}
          index={0}
          onIndexChange={() => void 0}
        />
      </RootPortal>
    </>
  )
}

export function GraphicsAspirations() {
  const [openGallery, setOpenGallery] = useState(false)
  const [sourceBounds, setSourceBounds] = useState<DOMRect | null>(null)

  const graphicsAspirationsSrc =
    journeyInfo[JourneySection.FreeTimeProjects].images[0]

  return (
    <>
      <AmbientImage
        src={graphicsAspirationsSrc}
        alt="graphics aspirations"
        className="hover:scale-110 hover:z-10 transition-[scale] ease-bounce duration-bounce cursor-pointer h-32 *:max-h-32"
        ambientOpacity={0.3}
        onClick={(event) => {
          setOpenGallery(true)
          setSourceBounds(event.currentTarget.getBoundingClientRect())
        }}
      />
      <RootPortal>
        <MaximizedGallery
          open={openGallery}
          onClose={() => setOpenGallery(false)}
          sourceBounds={sourceBounds}
          images={[graphicsAspirationsSrc]}
          index={0}
          onIndexChange={() => void 0}
        />
      </RootPortal>
    </>
  )
}
