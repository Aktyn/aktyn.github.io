import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
  type WheelEvent,
} from 'react'
import { mdiChevronLeft, mdiChevronRight, mdiFullscreen } from '@mdi/js'
import Icon from '@mdi/react'
import clsx from 'clsx'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { AutoSizer } from 'components/common/AutoSizer'
import { Maximizable } from 'components/common/Maximizable'
import './Gallery.scss'

type GalleryProps = {
  images: { src: string; content?: ReactNode }[]
}

export const Gallery = memo<GalleryProps>(({ images }) => {
  const scrollChangeTimestamp = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const [galleryHeight, setGalleryHeight] = useState(0)
  const [focusedIndex, setFocusedIndex] = useState(Math.floor((images.length - 0.5) / 2))
  const [maximizedImage, setMaximizedImage] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.style.setProperty('--galleryHeight', galleryHeight.toString() + 'px')
  }, [galleryHeight])

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      event.stopPropagation()

      if (maximizedImage || Date.now() - scrollChangeTimestamp.current < 500) {
        return
      }

      if (event.deltaY > 0) {
        scrollChangeTimestamp.current = Date.now()
        setFocusedIndex((prevIndex) => Math.min(images.length - 1, prevIndex + 1))
      } else if (event.deltaY < 0) {
        scrollChangeTimestamp.current = Date.now()
        setFocusedIndex((prevIndex) => Math.max(0, prevIndex - 1))
      }
    },
    [images.length, maximizedImage],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    let touchX = 0
    const threshold = 128

    const handleHorizontalMove = (delta: number) => {
      if (delta >= threshold) {
        setFocusedIndex((prevIndex) => Math.min(images.length - 1, prevIndex + 1))
      } else if (delta <= threshold) {
        setFocusedIndex((prevIndex) => Math.max(0, prevIndex - 1))
      }
    }

    const handleTouchStart = (event: TouchEvent) => {
      touchX = event.touches[0].clientX
    }
    const handleTouchMove = (event: TouchEvent) => {
      // event.stopPropagation()
      const x = event.touches[0].clientX
      const delta = touchX - x
      if (Math.abs(delta) >= threshold) {
        handleHorizontalMove(delta)
        touchX = x
      }
    }

    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
    }
  }, [images.length])

  return (
    <AutoSizer>
      {({ height }) => {
        setTimeout(() => setGalleryHeight(height), 1)

        return (
          <div ref={containerRef} className="gallery-main" onWheelCapture={handleWheel}>
            {images.map(({ src, content }, index) => (
              <div
                key={src}
                className={clsx('gallery-item', `pos-${index - focusedIndex}`)}
                onDoubleClick={() => setMaximizedImage(src)}
              >
                <GalleryImage src={src} className="reflection" />
                <Maximizable
                  maximized={maximizedImage === src}
                  onClose={() => setMaximizedImage(null)}
                >
                  <GalleryImage src={src} />
                </Maximizable>
                {content && <div className="content">{content}</div>}
                <div className="options">
                  <button className="icon" onClick={() => setMaximizedImage(src)}>
                    <Icon path={mdiFullscreen} size="1.5rem" />
                  </button>
                </div>
              </div>
            ))}
            <button
              className="gallery-navigation-button left"
              disabled={focusedIndex === 0}
              onClick={() => setFocusedIndex((prevIndex) => Math.max(0, prevIndex - 1))}
            >
              <Icon path={mdiChevronLeft} size="5rem" />
            </button>
            <button
              className="gallery-navigation-button right"
              disabled={focusedIndex === images.length - 1}
              onClick={() =>
                setFocusedIndex((prevIndex) => Math.min(images.length - 1, prevIndex + 1))
              }
            >
              <Icon path={mdiChevronRight} size="5rem" />
            </button>
          </div>
        )
      }}
    </AutoSizer>
  )
})

const GalleryImage: FC<{ src: string; className?: string }> = ({ src, className }) => {
  const [loaded, setLoaded] = useState(false)
  return (
    <LazyLoadImage
      src={src}
      className={clsx(className, { loaded })}
      delayTime={500}
      delayMethod="debounce"
      onLoad={() => setLoaded(true)}
    />
  )
}
