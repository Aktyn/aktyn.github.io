import { Expand } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { RootPortal } from "../portal/root-portal"
import { cn } from "~/lib/utils"

type GalleryProps = {
  images: Promise<string[]>
}

export function Gallery({ images }: GalleryProps) {
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

  return (
    <div className="grid grid-rows-1 grid-cols-1 items-center h-full">
      {/* TODO: support multiple images */}
      {loadedImages.map((src) => (
        <Image key={src} src={src} />
      ))}
    </div>
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
      <div className="relative h-fit *:rounded-lg w-fit md:justify-self-end max-h-96 inline-grid grid-rows-1 hover:*:[div]:opacity-100 hover:*:[div]:translate-y-0 hover:*:[div]:*:[svg]:scale-100 hover:*:[div]:*:[svg]:rotate-0 hover:*:[div]:*:[p]:scale-100">
        <img
          src={src}
          loading="lazy"
          className="absolute max-md:inset-x-0 w-auto h-full mx-auto md:right-0 blur-3xl scale-110 opacity-50 -z-1 pointer-events-none"
        />
        <img
          src={src}
          loading="lazy"
          className="max-h-full w-auto max-w-full ml-auto max-md:mx-auto"
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
