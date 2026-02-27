import { useState } from 'react'
import { AmbientImage } from '~/components/gallery/ambient-image'
import { MaximizedGallery } from '~/components/gallery/maximized-gallery'
import { RootPortal } from '~/components/portal/root-portal'
import { journeyInfo, JourneySection } from '~/lib/journey-info'

export function Diploma() {
  const [openGallery, setOpenGallery] = useState(false)
  const [sourceBounds, setSourceBounds] = useState<DOMRect | null>(null)

  const diplomaSrc = journeyInfo[JourneySection.Education].images[0]

  return (
    <>
      <AmbientImage
        src={diplomaSrc}
        alt="diploma"
        className="h-48 cursor-pointer transition-[scale] duration-bounce ease-bounce *:max-h-48 hover:z-10 hover:scale-110"
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

  const graphicsAspirationsSrc = journeyInfo[JourneySection.FreeTimeProjects].images[0]

  return (
    <>
      <AmbientImage
        src={graphicsAspirationsSrc}
        alt="graphics aspirations"
        className="h-32 cursor-pointer transition-[scale] duration-bounce ease-bounce *:max-h-32 hover:z-10 hover:scale-110"
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
