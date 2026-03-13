import { type ComponentProps, type ReactNode } from 'react'
import { Separator } from '~/components/common/separator'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'

type TreeTimelineProps = ComponentProps<'div'> & {
  header?: ReactNode
  items: Array<{
    date: string | { start: string; end: string }
    content: ReactNode
  }>
}

export function TreeTimeline({ header, items, ...divProps }: TreeTimelineProps) {
  return (
    <div {...divProps} className={cn('flex flex-col font-medium', divProps.className)}>
      {header}
      <Separator className="bg-transparent bg-linear-to-r from-transparent via-foreground/20 to-transparent max-sm:via-[calc(var(--spacing)*2)] sm:max-w-64 sm:via-25%" />
      <div className="flex flex-col">
        <div className="flex w-32 sm:justify-center">
          <span className="h-4 w-px bg-foreground/20 max-sm:ml-2" />
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-stretch gap-0 *:last:flex-0 *:last:grow max-sm:flex-wrap"
          >
            <div className="grid w-auto grid-cols-1 items-stretch self-stretch sm:w-32 sm:grid-rows-[1fr_auto_1fr] sm:justify-center">
              <span
                className={cn(
                  'min-h-3 w-px bg-foreground/20 max-sm:ml-2 max-sm:min-h-6 sm:mx-auto',
                  index === 0 && 'max-sm:min-h-0',
                )}
              />
              <div className="w-full rounded-md border border-foreground/50 bg-foreground/10 fill-foreground-darker px-2 py-0.5 text-center text-sm font-semibold text-foreground-darker sm:px-1">
                {typeof item.date === 'string' ? (
                  item.date
                ) : (
                  <div className="flex items-center justify-stretch max-sm:gap-1 sm:w-auto sm:flex-col">
                    <span>{item.date.start}</span>
                    <SvgIcon icon="South" className="size-4 text-muted-foreground max-sm:hidden" />
                    <SvgIcon icon="East" className="size-4 text-muted-foreground sm:hidden" />
                    <span>{item.date.end}</span>
                  </div>
                )}
              </div>
              <span
                className={cn(
                  'w-px max-sm:ml-2 max-sm:min-h-2 max-sm:bg-foreground/20 sm:mx-auto',
                  index < items.length - 1 && 'bg-foreground/20 sm:min-h-3',
                )}
              />
            </div>
            <div className="mr-3 flex h-full w-8 flex-row items-center max-sm:hidden">
              <span className="h-px grow bg-foreground/20" />
              <span className="h-full w-px bg-linear-to-b from-transparent via-foreground/20 to-transparent" />
            </div>
            <div className="text-balance max-sm:ml-2 max-sm:min-w-[calc(100%-var(--spacing)*2-1px)] max-sm:border-l max-sm:border-foreground/20 max-sm:pl-2 sm:my-2">
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
