import { animate, createTimeline, stagger, type Timeline } from 'animejs'
import {
  type ComponentProps,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { GalleryPagination } from '~/components/gallery/gallery-pagination'
import { useStateToRef } from '~/hooks/useStateToRef'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'

const ENTRY_DURATION = 400

type MaximizedGalleryProps = {
  open: boolean
  onClose: () => void
  sourceBounds?: DOMRect | null
  images: string[]
  index: number
  onIndexChange: (index: number) => void
}

export function MaximizedGallery({
  open,
  onClose,
  sourceBounds,
  images,
  index,
  onIndexChange,
}: MaximizedGalleryProps) {
  const ref = useRef<HTMLDivElement>(null)
  const enteredRef = useRef(false)

  const [mounted, setMounted] = useState(false)
  const [entryAnimation, setEntryAnimation] = useState<Timeline | null>(null)

  const closeRef = useStateToRef(onClose)

  // Animations setup
  useLayoutEffect(() => {
    const root = ref.current

    if (!root || !mounted) {
      return
    }

    const timeline = createTimeline({
      autoplay: true,
    })

    const closeButton = root.querySelector('[data-slot="close-button"]')
    if (closeButton) {
      timeline.sync(
        animate(closeButton, {
          opacity: [0, 1],
          translateY: ['-100%', '0%'],
          scale: [0.618, 1],
          duration: ENTRY_DURATION,
          ease: 'outSine',
        }),
        0,
      )
    }

    const pagination = root.querySelector('[data-slot="pagination"]')
    if (pagination) {
      timeline.sync(
        animate(pagination, {
          opacity: [0, 1],
          translateY: ['100%', '0%'],
          duration: ENTRY_DURATION,
          ease: 'outSine',
        }),
        0,
      )
    }

    const prevButton = root.querySelector('[data-slot="prev-button"]')
    const nextButton = root.querySelector('[data-slot="next-button"]')
    if (prevButton && nextButton) {
      timeline.sync(
        animate([prevButton, nextButton], {
          opacity: [0, 1],
          translateX: [stagger(['-100%', '100%']), '0%'],
          duration: ENTRY_DURATION,
          ease: 'outSine',
        }),
        0,
      )
    }

    const imagesContainer = root.querySelector('[data-slot="images-container"]')
    if (imagesContainer) {
      timeline.sync(
        animate(imagesContainer, {
          opacity: [0, 1],
          duration: ENTRY_DURATION,
          ease: 'outSine',
        }),
        0,
      )
      timeline.sync(
        animate(imagesContainer.querySelectorAll('[data-slot="image"]'), {
          scale: [0.618, 1],
          duration: ENTRY_DURATION,
          ease: 'outSine',
        }),
        0,
      )
    }

    const scrollableContainer = ref.current?.querySelector('[data-slot="images-container"] > *')

    const cancelEvent = (event: Event) => {
      event.stopPropagation()
      event.preventDefault()
    }

    scrollableContainer?.addEventListener('wheel', cancelEvent)
    scrollableContainer?.addEventListener('touchmove', cancelEvent)

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntryAnimation((prev) => {
      if (prev) {
        prev.revert()
      }
      return timeline
    })

    return () => {
      scrollableContainer?.removeEventListener('wheel', cancelEvent)
      scrollableContainer?.removeEventListener('touchmove', cancelEvent)
    }
  }, [images.length, mounted])

  // Animations and mounted state controls
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true)

      if (entryAnimation?.paused) {
        entryAnimation?.restart()
      } else {
        entryAnimation?.play()
      }
    } else {
      entryAnimation?.reverse()

      const timeout = setTimeout(() => {
        setMounted(false)
      }, ENTRY_DURATION * 1.5)
      return () => clearTimeout(timeout)
    }
  }, [open, entryAnimation])

  const handleClose = useCallback(() => {
    closeRef.current()
  }, [closeRef])

  useEffect(() => {
    if (!mounted) {
      enteredRef.current = false
      return
    }

    const target = ref.current?.querySelector(
      `[data-slot="images-container"] [data-index="${index}"]`,
    )

    target?.scrollIntoView({
      behavior: enteredRef.current ? 'smooth' : 'instant',
      inline: 'center',
    })

    if (target && !enteredRef.current) {
      animate(target, {
        width: [sourceBounds?.width ?? 0, 'auto'],
        duration: ENTRY_DURATION,
        ease: 'linear',
      })
    }

    enteredRef.current = true
  }, [index, mounted, sourceBounds])

  // Escape key handler
  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, handleClose])

  if (!mounted) {
    return null
  }

  return (
    <div ref={ref} className={cn('fixed inset-0 z-90', !open && 'pointer-events-none')}>
      <div className="relative grid size-full grid-rows-[1fr_auto] **:[svg]:size-6">
        <div className={cn('grid grid-cols-[auto_1fr_auto]', images.length <= 1 && 'grid-cols-1')}>
          {images.length > 1 && (
            <NavButton
              data-slot="prev-button"
              direction={-1}
              disabled={index === 0}
              onClick={(event) => {
                event.stopPropagation()
                onIndexChange(index - 1)
              }}
            />
          )}
          <div data-slot="images-container" className="relative">
            <div
              className={cn(
                'pointer-events-none absolute inset-0 no-scrollbar flex flex-row items-stretch justify-start gap-x-8 overflow-x-auto',
                images.length > 1 && '-mx-8 -mb-6',
              )}
            >
              {images.map((image, index) => (
                <div
                  key={image}
                  data-index={index}
                  className="flex h-full min-w-full items-center justify-center"
                >
                  <div className="-z-1 mr-[-100%] flex size-full min-w-full items-center justify-center bg-red-300/10">
                    <img
                      src={image}
                      alt=""
                      aria-hidden="true"
                      className="size-full scale-105 object-cover blur-lg"
                    />
                  </div>
                  <div
                    className={cn(
                      'flex size-full items-center justify-center bg-black/50',
                      images.length > 1 && 'px-8',
                    )}
                  >
                    <img
                      data-slot="image"
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="pointer-events-auto h-auto max-h-full max-w-full object-contain"
                      onDoubleClick={handleClose}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {images.length > 1 && (
            <NavButton
              data-slot="next-button"
              direction={1}
              disabled={index === images.length - 1}
              onClick={(event) => {
                event.stopPropagation()
                onIndexChange(index + 1)
              }}
            />
          )}
        </div>
        {images.length > 1 && (
          <div data-slot="pagination" className="flex h-6 flex-row items-center justify-center p-1">
            <GalleryPagination count={images.length} index={index} />
          </div>
        )}

        <div className="absolute inset-x-0 top-0 z-20 flex flex-row items-center justify-end p-2">
          <button
            data-slot="close-button"
            aria-label="Close gallery"
            className="rounded-full border border-white/40 bg-black/50 p-2 transition-colors hover:bg-black hover:*:scale-110"
            onClick={handleClose}
          >
            <SvgIcon icon="Close" className="transition-transform duration-spring ease-spring" />
          </button>
        </div>
      </div>
    </div>
  )
}

type NavButtonProps = {
  direction: -1 | 1
} & ComponentProps<'button'>

function NavButton({ direction, ...buttonProps }: NavButtonProps) {
  return (
    <button
      {...buttonProps}
      aria-label={direction === -1 ? 'Previous image' : 'Next image'}
      className={cn(
        'z-5 my-auto flex h-full w-8 flex-col justify-center rounded-md bg-foreground-lighter/0 p-1 transition-colors not-disabled:hover:bg-foreground/50 disabled:fill-muted-foreground/50 disabled:opacity-50',
        direction === -1 && 'not-disabled:hover:*:-translate-x-[12.5%]',
        direction === 1 && 'not-disabled:hover:*:translate-x-[12.5%]',
        buttonProps.className,
      )}
    >
      <SvgIcon
        icon={direction === -1 ? 'ChevronLeft' : 'ChevronRight'}
        className="transition-transform"
      />
    </button>
  )
}
