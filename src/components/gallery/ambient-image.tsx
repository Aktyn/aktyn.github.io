import { TooltipTrigger } from '@radix-ui/react-tooltip'
import { useState, type ComponentProps } from 'react'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'
import { Tooltip, TooltipContent } from '../common/tooltip'
import { useTranslation } from 'react-i18next'

type AmbientImageProps = ComponentProps<'div'> & {
  src: string
  alt?: string
  ambientOpacity?: number
}

export function AmbientImage({ src, alt, ambientOpacity = 0.5, ...divProps }: AmbientImageProps) {
  const { t } = useTranslation()

  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div {...divProps} className={cn(`relative z-1`, divProps.className)}>
      {hasError ? (
        <Tooltip disableHoverableContent>
          <TooltipTrigger asChild>
            <div
              className="
                flex aspect-[1.618] size-full animate-in items-center
                justify-center rounded-xl border border-red-200/20 bg-red-200/10
                p-4 duration-800 fade-in
              "
            >
              <SvgIcon icon="BrokenImage" className="size-10 fill-red-200" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {t('error.imageNotFound')}:&nbsp;<b>{src}</b>
          </TooltipContent>
        </Tooltip>
      ) : (
        <>
          {isLoaded && (
            <img
              alt={`${alt}-blur`}
              aria-hidden="true"
              data-src={src}
              loading="lazy"
              className="
                lazyload pointer-events-none absolute inset-0 -z-1 h-full
                scale-110 blur-lg
              "
              style={{ opacity: ambientOpacity }}
            />
          )}
          <img
            alt={alt}
            data-src={src}
            loading="lazy"
            className={cn(
              `
                lazyload h-full max-w-fit rounded-md
                max-md:max-h-full
                md:h-auto md:w-full md:max-w-full
              `,
              !isLoaded && 'opacity-0',
            )}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setHasError(true)
            }}
          />
        </>
      )}
    </div>
  )
}
