import { lazy, Suspense, useState } from 'react'
import { AmbientImage } from '~/components/gallery/ambient-image'
import { RootPortal } from '~/components/portal/root-portal'
import { journeyInfo, JourneySection } from '~/lib/journey-info'

const LazyMaximizedGallery = lazy(() => import('~/components/gallery/maximized-gallery'))

export function Diploma() {
  const [openGallery, setOpenGallery] = useState(false)
  const [sourceBounds, setSourceBounds] = useState<DOMRect | null>(null)

  const diplomaSrc = journeyInfo[JourneySection.Education].images[0]

  return (
    <>
      <AmbientImage
        src={diplomaSrc}
        alt="diploma"
        className="h-48 cursor-pointer transition-[scale] *:max-h-48 hover:z-10 hover:scale-110"
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
            images={[diplomaSrc]}
            index={0}
            onIndexChange={() => void 0}
          />
        </Suspense>
      </RootPortal>
    </>
  )
}
