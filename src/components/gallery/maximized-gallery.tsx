import { Button } from "~/components/ui/button"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "~/lib/utils"
import { GalleryPagination } from "~/components/gallery/gallery-pagination"
import { DynamicIcon } from "lucide-react/dynamic"
import { useStateToRef } from "~/hooks/useStateToRef"

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
  const [mounted, setMounted] = useState(false)

  const onCloseRef = useStateToRef(onClose)
  useEffect(() => {
    if (open) {
      setMounted(true)

      const handleKeyDown = (event: globalThis.KeyboardEvent) => {
        if (event.key === "Escape") {
          onCloseRef.current()
        }
      }

      document.addEventListener("keydown", handleKeyDown)

      return () => document.removeEventListener("keydown", handleKeyDown)
    }

    const timeout = setTimeout(() => {
      setMounted(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [onCloseRef, open])

  if (!mounted) {
    return null
  }

  const onImageRef = (element: HTMLImageElement | null) => {
    if (!element || element.dataset.state === "positioned" || !sourceBounds) {
      return
    }
    const rect = element.getBoundingClientRect()

    const scaleX = sourceBounds.width / rect.width
    const scaleY = sourceBounds.height / rect.height
    const translateX =
      sourceBounds.x + sourceBounds.width / 2 - (rect.x + rect.width / 2)
    const translateY =
      sourceBounds.y + sourceBounds.height / 2 - (rect.y + rect.height / 2)

    element.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`
    element.dataset.state = "positioned"

    setTimeout(() => {
      element.style.transform = "translate(0, 0) scale(1, 1)"
      element.dataset.state = ""
    }, 16)
  }

  return (
    <div className={cn("fixed inset-0 z-90", !open && "pointer-events-none")}>
      <div className="size-full relative *:absolute flex flex-col items-center justify-center">
        <div
          className={cn(
            "bg-background inset-0 transition-opacity ease-in-out duration-600 starting:opacity-0",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div className="inset-0 flex items-center justify-center overflow-hidden">
          <img
            alt="maximized-image"
            src={images[index]}
            className={cn(
              "blur-3xl fill-mode-both duration-600 scale-110",
              open ? "animate-in fade-in delay-300" : "animate-out fade-out",
            )}
          />
        </div>
        <div className="inset-0 flex items-center justify-center overflow-hidden">
          <img
            ref={onImageRef}
            alt="maximized-image"
            src={images[index]}
            className={cn(
              "max-h-full fill-mode-both duration-400 starting:opacity-0 not-data-[state=positioned]:transition-[transform,opacity]",
              sourceBounds && open
                ? "transition-none"
                : "transition-opacity opacity-0",
              open && "opacity-100",
            )}
          />
        </div>
        {images.length > 1 && (
          <GalleryPagination
            count={images.length}
            index={index}
            className={cn(
              "bottom-2 fill-mode-both duration-600",
              open
                ? "animate-in fade-in slide-in-from-bottom"
                : "animate-out fade-out slide-out-to-bottom",
            )}
          />
        )}
        {arrows.map((arrow, arrowIndex) => (
          <Button
            key={arrowIndex}
            variant="outline"
            size="icon"
            className={cn(
              "fill-mode-both duration-600 inset-y-auto fade-in fade-out bg-background/50",
              arrow.className,
              open && (arrowIndex === 0 ? index > 0 : index < images.length - 1)
                ? "animate-in"
                : "animate-out pointer-events-none",
            )}
            onClick={() => onIndexChange(index + arrow.direction)}
          >
            <DynamicIcon name={arrow.icon} />
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "top-2 right-2 fill-mode-both duration-600",
            open
              ? "animate-in fade-in slide-in-from-top slide-in-from-right ease-out"
              : "animate-out fade-out slide-out-to-top slide-out-to-right ease-in",
          )}
          onClick={onClose}
        >
          <X />
        </Button>
      </div>
    </div>
  )
}

const arrows = [
  {
    direction: -1,
    className: "left-1 slide-in-from-left slide-out-to-left",
    icon: "chevron-left",
  },
  {
    direction: 1,
    className: "right-1 slide-in-from-right slide-out-to-right",
    icon: "chevron-right",
  },
] as const
