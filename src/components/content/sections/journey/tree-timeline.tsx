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
    <div {...divProps} className={cn('flex max-w-full flex-col font-medium', divProps.className)}>
      {header}
      <Separator className="bg-transparent bg-linear-to-r from-transparent via-foreground/20 to-transparent max-md:via-[calc(var(--spacing)*2)] md:max-w-64 md:via-25%" />
      <div className="flex flex-col">
        <div className="flex w-32 md:justify-center">
          <span className="h-4 w-px bg-foreground/20 max-md:ml-2" />
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-stretch gap-0 *:last:flex-0 *:last:grow max-md:flex-wrap"
          >
            <div className="grid w-auto grid-cols-1 items-stretch self-stretch md:w-32 md:grid-rows-[1fr_auto_1fr] md:justify-center">
              <span
                className={cn(
                  'min-h-3 w-px bg-foreground/20 max-md:ml-2 max-md:min-h-6 md:mx-auto',
                  index === 0 && 'max-md:min-h-0',
                )}
              />
              <div className="w-full rounded-md border border-foreground/50 bg-foreground/10 fill-foreground-darker px-2 py-0.5 text-center text-sm font-semibold text-muted-foreground md:px-1">
                {typeof item.date === 'string' ? (
                  item.date
                ) : (
                  <div className="flex items-center justify-stretch max-md:gap-1 md:w-auto md:flex-col">
                    <span>{item.date.start}</span>
                    <SvgIcon icon="South" className="size-4 text-muted-foreground max-md:hidden" />
                    <SvgIcon icon="East" className="size-4 text-muted-foreground md:hidden" />
                    <span>{item.date.end}</span>
                  </div>
                )}
              </div>
              <span
                className={cn(
                  'w-px max-md:ml-2 max-md:min-h-2 max-md:bg-foreground/20 md:mx-auto',
                  index < items.length - 1 && 'bg-foreground/20 md:min-h-3',
                )}
              />
            </div>
            <div className="mr-3 flex h-full w-8 flex-row items-center max-md:hidden">
              <span className="h-px grow bg-foreground/20" />
              <span className="h-full w-px bg-linear-to-b from-transparent via-foreground/20 to-transparent" />
            </div>
            <div className="text-balance max-md:ml-2 max-md:min-w-[calc(100%-var(--spacing)*2-1px)] max-md:border-l max-md:border-foreground/20 max-md:pl-2 md:my-2">
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
