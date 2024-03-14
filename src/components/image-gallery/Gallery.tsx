import { type FC, memo, useRef, useState, type ReactNode, useEffect } from 'react'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import Icon from '@mdi/react'
import clsx from 'clsx'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import './Gallery.scss'
import { AutoSizer } from 'components/common/AutoSizer'

type GalleryProps = {
  images: { src: string; content?: ReactNode }[]
}

export const Gallery = memo<GalleryProps>(({ images }) => {
  const scrollChangeTimestamp = useRef(0)

  const [galleryHeight, setGalleryHeight] = useState(0)
  const [focusedIndex, setFocusedIndex] = useState(Math.floor((images.length - 0.5) / 2))

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

              if (Date.now() - scrollChangeTimestamp.current < 500) {
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
              <div key={src} className={clsx('gallery-item', `pos-${index - focusedIndex}`)}>
                <GalleryImage src={src} />
                {content && <div className="content">{content}</div>}
                {/* TODO: maximize button */}
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

const GalleryImage: FC<{ src: string }> = ({ src }) => {
  const [loaded, setLoaded] = useState(false)
  return (
    <LazyLoadImage
      src={src}
      className={clsx({ loaded })}
      delayTime={500}
      delayMethod="debounce"
      onLoad={() => setLoaded(true)}
    />
  )
}
