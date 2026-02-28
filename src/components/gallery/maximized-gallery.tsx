import { Button } from '~/components/common/tooltip'
import { X } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { clamp, cn } from '~/lib/utils'
import { GalleryPagination } from '~/components/gallery/gallery-pagination'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useStateToRef } from '~/hooks/useStateToRef'

type MaximizedGalleryProps = {
  open: boolean
  onClose: () => void
  sourceBounds?: DOMRect | null
  images: string[]
  index: number
  onIndexChange: (index: number) => void
}

const arrows = [
  {
    direction: -1,
    className: 'left-1 slide-in-from-left slide-out-to-left',
    icon: 'chevron-left',
  },
  {
    direction: 1,
    className: 'right-1 slide-in-from-right slide-out-to-right',
    icon: 'chevron-right',
  },
] as const

export function MaximizedGallery({
  open,
  onClose,
  sourceBounds,
  images,
  index,
  onIndexChange,
}: MaximizedGalleryProps) {
  const slidingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [mounted, setMounted] = useState(false)
  const [entryAnimation, setEntryAnimation] = useState(true)
  const [slidingDirection, setSlidingDirection] = useState(0)

  const handleNavigate = (dir: 1 | -1) => {
    const target = clamp(index + dir, 0, images.length - 1)
    if (target === index) {
      return
    }

    onIndexChange(target)

    setSlidingDirection(dir)

    if (slidingTimeoutRef.current) {
      clearTimeout(slidingTimeoutRef.current)

      slidingTimeoutRef.current = setTimeout(() => {
        setSlidingDirection(0)
        slidingTimeoutRef.current = null
      }, 400)
    }
  }

  const navigateWithRefs = useStateToRef(handleNavigate)

  const onCloseRef = useStateToRef(onClose)
  if (open && !mounted) {
    setMounted(true)
  }

  if (open && !entryAnimation && !mounted) {
    setEntryAnimation(true)
  }

  if (!open && slidingDirection !== 0) {
    setSlidingDirection(0)
  }

  useEffect(() => {
    if (open) {
      // setPendingIndex(null)

      const handleKeyDown = (event: globalThis.KeyboardEvent) => {
        if (event.key === 'Escape') {
          onCloseRef.current()
          return
        }

        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          navigateWithRefs.current(-1)
          return
        }

        if (event.key === 'ArrowRight') {
          event.preventDefault()
          navigateWithRefs.current(1)
        }
      }

      const timeout = setTimeout(() => {
        setEntryAnimation(false)
      }, 800)

      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        clearTimeout(timeout)
      }
    } else {
      // setEntryAnimation(true)
    }

    const timeout = setTimeout(() => {
      setMounted(false)
    }, 600)

    return () => clearTimeout(timeout)
  }, [navigateWithRefs, onCloseRef, open])

  if (!mounted) {
    return null
  }

  const onImageRef = (element: HTMLImageElement | null) => {
    if (!element || element.dataset.state === 'positioned' || !sourceBounds) {
      return
    }
    const rect = element.getBoundingClientRect()

    const scaleX = sourceBounds.width / rect.width
    const scaleY = sourceBounds.height / rect.height
    const translateX = sourceBounds.x + sourceBounds.width / 2 - (rect.x + rect.width / 2)
    const translateY = sourceBounds.y + sourceBounds.height / 2 - (rect.y + rect.height / 2)

    element.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`
    element.dataset.state = 'positioned'

    setTimeout(() => {
      element.style.transform = 'translate(0, 0) scale(1, 1)'
      element.dataset.state = ''
    }, 16)
  }

  return (
    <div className={cn('fixed inset-0 z-90', !open && 'pointer-events-none')}>
      <div className="relative flex size-full flex-col items-center justify-center *:absolute">
        <div
          className={cn(
            'inset-0 bg-background transition-opacity duration-bounce ease-in-out starting:opacity-0',
            open ? 'opacity-100' : 'opacity-0',
          )}
        />
        {images.map((img, imgIndex) => (
          <Fragment key={img}>
            <div
              className={cn(
                'inset-0 z-10 overflow-hidden duration-bounce fill-mode-both',
                open ? 'animate-in delay-300 fade-in' : 'animate-out fade-out',
              )}
            >
              <div
                className={cn(
                  'flex size-full items-center justify-center transition-transform duration-500 ease-in-out select-none',
                )}
                style={{
                  transform: `translate(${(imgIndex - index) * 100}%, 0)`,
                }}
              >
                {(index === imgIndex || index === imgIndex + slidingDirection) && (
                  <img
                    ref={onImageRef}
                    alt="maximized-image-blur"
                    src={img}
                    className="absolute scale-110 blur-3xl"
                  />
                )}
              </div>
            </div>
            <div
              className={cn(
                'inset-0 z-20 flex items-center justify-center overflow-hidden transition-transform duration-500 ease-in-out select-none',
              )}
              style={{
                transform: `translate(${(imgIndex - index) * 100}%, 0)`,
              }}
            >
              {(index === imgIndex || index === imgIndex + slidingDirection) && (
                <img
                  ref={entryAnimation ? onImageRef : undefined}
                  alt="maximized-image"
                  src={img}
                  className={cn(
                    'h-auto max-h-full max-w-full object-contain duration-bounce fill-mode-both not-data-[state=positioned]:transition-[transform,opacity]',
                    entryAnimation ? 'starting:opacity-0' : 'starting:opacity-100',
                    sourceBounds && open ? 'transition-none' : 'opacity-0 transition-opacity',
                    open && 'opacity-100',
                  )}
                />
              )}
            </div>
          </Fragment>
        ))}
        {images.length > 1 && (
          <GalleryPagination
            count={images.length}
            index={index}
            className={cn(
              'bottom-2 z-30 duration-600 fill-mode-both',
              open
                ? 'animate-in fade-in slide-in-from-bottom'
                : 'animate-out fade-out slide-out-to-bottom',
            )}
          />
        )}
        {images.length > 1 &&
          arrows.map((arrow, arrowIndex) => {
            const allowed = arrowIndex === 0 ? index > 0 : index < images.length - 1
            return (
              <Button
                key={arrowIndex}
                variant="outline"
                size="icon"
                className={cn(
                  'inset-y-auto z-30 bg-background/50 duration-600 fill-mode-both fade-in fade-out',
                  arrow.className,
                  open && allowed ? 'animate-in' : 'pointer-events-none animate-out',
                )}
                onClick={() => handleNavigate(arrow.direction)}
              >
                <DynamicIcon name={arrow.icon} />
              </Button>
            )
          })}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'top-2 right-2 z-30 duration-600 fill-mode-both',
            open
              ? 'animate-in ease-out fade-in slide-in-from-right slide-in-from-top'
              : 'animate-out ease-in fade-out slide-out-to-right slide-out-to-top',
          )}
          onClick={onClose}
        >
          <X />
        </Button>
      </div>
    </div>
  )
}
