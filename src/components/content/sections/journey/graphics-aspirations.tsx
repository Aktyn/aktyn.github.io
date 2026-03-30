import { lazy, Suspense, useState } from 'react'
import { AmbientImage } from '~/components/gallery/ambient-image'
import { RootPortal } from '~/components/portal/root-portal'
import { journeyInfo, JourneySection } from '~/lib/journey-info'

const LazyMaximizedGallery = lazy(() => import('~/components/gallery/maximized-gallery'))

export function GraphicsAspirations() {
  const [openGallery, setOpenGallery] = useState(false)
  const [sourceBounds, setSourceBounds] = useState<DOMRect | null>(null)

  const graphicsAspirationsSrc = journeyInfo[JourneySection.FreeTimeProjects].images[0]

  return (
    <>
      <AmbientImage
        src={graphicsAspirationsSrc}
        alt="graphics aspirations"
        className="mr-auto h-32 cursor-pointer transition-[scale] *:max-h-32 hover:z-10 hover:scale-110"
        ambientOpacity={0.3}
        onClick={(event) => {
          setOpenGallery(true)
          setSourceBounds(event.currentTarget.getBoundingClientRect())
        }}
      />
      <RootPortal>
        <Suspense fallback={<span className="fixed inset-0">...</span>}>
          <LazyMaximizedGallery
            open={openGallery}
            onClose={() => setOpenGallery(false)}
            sourceBounds={sourceBounds}
            images={[graphicsAspirationsSrc]}
            index={0}
            onIndexChange={() => void 0}
          />
        </Suspense>
      </RootPortal>
    </>
  )
}
