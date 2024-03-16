import { memo, useEffect, useRef, useState, type FC, type ReactNode } from 'react'
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

  const [galleryHeight, setGalleryHeight] = useState(0)
  const [focusedIndex, setFocusedIndex] = useState(Math.floor((images.length - 0.5) / 2))
  const [maximizedImage, setMaximizedImage] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.style.setProperty('--galleryHeight', galleryHeight.toString() + 'px')
  }, [galleryHeight])

  return (
    <AutoSizer>
      {({ height }) => {
        setTimeout(() => setGalleryHeight(height), 1)

        return (
          <div
            className="gallery-main"
            onWheelCapture={(event) => {
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
            }}
          >
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
