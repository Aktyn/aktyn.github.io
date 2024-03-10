import { memo, useRef, useState, type ReactNode } from 'react'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import Icon from '@mdi/react'
import clsx from 'clsx'

import './Gallery.scss'

type GalleryProps = {
  images: { src: string; content?: ReactNode }[]
}

export const Gallery = memo<GalleryProps>(({ images }) => {
  const scrollChangeTimestamp = useRef(0)

  const [focusedIndex, setFocusedIndex] = useState(Math.floor((images.length - 0.5) / 2))

  // TODO: lazy load images and use .webp format for better performance

  return (
    <div
      className="gallery-main"
      onWheel={(event) => {
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
          <img src={src} />
          {content && <div className="content">{content}</div>}
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
        onClick={() => setFocusedIndex((prevIndex) => Math.min(images.length - 1, prevIndex + 1))}
      >
        <Icon path={mdiChevronRight} size="5rem" />
      </button>
    </div>
  )
})
