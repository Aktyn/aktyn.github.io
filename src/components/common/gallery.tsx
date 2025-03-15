import { Expand } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { RootPortal } from "../portal/root-portal"
import { cn } from "~/lib/utils"
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"

type GalleryProps = {
  images: Promise<string[]>
  rtl?: boolean
}

export function Gallery({ images, rtl = false }: GalleryProps) {
  const scrollAreaContainerRef = useRef<HTMLDivElement>(null)

  const [loadedImages, setLoadedImages] = useState<string[]>([])

  useEffect(() => {
    let mounted = true
    images.then((images) => {
      if (mounted) {
        setLoadedImages(images)
      }
    })

    return () => {
      mounted = false
    }
  }, [images])

  useEffect(() => {
    const scrollArea = scrollAreaContainerRef.current?.querySelector(
      "[data-slot='scroll-area-viewport']",
    ) as HTMLElement | null
    if (!scrollArea) {
      return
    }

    const handleMouseWheel = (event: WheelEvent) => {
      const hasHorizontalScroll =
        scrollArea.scrollWidth > scrollArea.clientWidth
      const hasVerticalScroll =
        scrollArea.scrollHeight > scrollArea.clientHeight
      if (hasHorizontalScroll && !hasVerticalScroll) {
        scrollArea.scrollTo({
          left: scrollArea.scrollLeft + event.deltaX + event.deltaY,
          behavior: "instant",
        })
        event.preventDefault()
        event.stopPropagation()
      }
    }

    scrollArea.addEventListener("wheel", handleMouseWheel)

    return () => {
      scrollArea.removeEventListener("wheel", handleMouseWheel)
    }
  }, [loadedImages.length])

  if (!loadedImages) {
    return null
  }

  return (
    <ScrollArea
      ref={scrollAreaContainerRef}
      dir={rtl ? "ltr" : "rtl"}
      className={cn(
        "**:data-[orientation=vertical]:hidden **:data-[slot=scroll-area-viewport]:py-8 max-lg:**:data-[slot=scroll-area-viewport]:py-4 max-lg:**:data-[slot=scroll-area-viewport]:pt-48 max-lg:**:data-[slot=scroll-area-viewport]:h-97 **:data-[slot=scroll-area-viewport]:box-content max-lg:[mask-image:none]!",
        rtl
          ? "lg:-ml-48 **:data-[slot=scroll-area-viewport]:pr-8 max-lg:**:data-[slot=scroll-area-viewport]:pr-4"
          : "lg:-mr-48 **:data-[slot=scroll-area-viewport]:pl-8 max-lg:**:data-[slot=scroll-area-viewport]:pl-4",
      )}
      style={{
        maskImage: rtl
          ? "linear-gradient(to left, transparent 0%, black calc(var(--spacing)*12), black calc(100% - var(--spacing)*64), transparent 100%)"
          : "linear-gradient(to right, transparent 0%, black calc(var(--spacing)*12), black calc(100% - var(--spacing)*64), transparent 100%)",
      }}
    >
      <div className="flex flex-row justify-start items-center *:shrink-0 gap-x-4">
        <span className="block w-44 max-lg:w-1">&nbsp;</span>
        {loadedImages.map((src) => (
          <Image key={src} src={src} />
        ))}
      </div>
      <div className="max-lg:hidden" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

function Image({ src }: { src: string }) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [isExpanded, setIsExpanded] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false)
      setIsClosing(false)
      timeoutRef.current = null
    }, 500)
  }

  return (
    <>
      <div className="max-lg:mx-auto relative *:rounded-lg w-fit md:justify-self-end inline-grid grid-rows-1 hover:*:[div]:opacity-100 hover:*:[div]:translate-y-0 hover:*:[div]:*:[svg]:scale-100 hover:*:[div]:*:[svg]:rotate-0 hover:*:[div]:*:[p]:scale-100 *:[img]:h-96">
        <img
          src={src}
          loading="lazy"
          className="absolute max-md:inset-x-0 w-auto mx-auto md:right-0 blur-3xl scale-110 opacity-50 -z-1 pointer-events-none"
        />
        <img
          src={src}
          loading="lazy"
          className="w-auto ml-auto max-md:mx-auto object-cover"
          onDoubleClick={() => {
            setIsExpanded(true)
            setIsClosing(false)
          }}
        />
        <div
          className="absolute inset-x-2 top-2 ml-auto w-fit inline-flex flex-row items-center justify-center gap-4 px-4 py-2 overflow-hidden border border-transparent drop-shadow-[0_0_12px_var(--primary-color)] bg-background/50 backdrop-blur-xs opacity-0 translate-y-full transition-[opacity,translate,border-color,background-color] duration-300 cursor-pointer hover:border-primary hover:bg-primary/50 hover:*:[svg]:scale-120!"
          onClick={() => {
            setIsExpanded(true)
            setIsClosing(false)
          }}
        >
          <Expand className="size-6 scale-[0.618] rotate-22 transition-transform" />
          <p className="text-sm font-bold scale-[0.618] transition-transform">
            Click to expand
          </p>
        </div>
      </div>
      {isExpanded && (
        <RootPortal>
          <div
            className={cn(
              "fixed inset-0 bg-background/50 backdrop-blur-sm backdrop-saturate-150 z-90 flex items-center justify-center fill-mode-both",
              isClosing ? "animate-out fade-out" : "animate-in fade-in",
            )}
            onClick={handleClose}
          >
            <img
              src={src}
              loading="lazy"
              className="max-h-full w-auto max-w-full m-auto max-md:mx-auto animate-in zoom-in-90"
            />
          </div>
        </RootPortal>
      )}
    </>
  )
}
