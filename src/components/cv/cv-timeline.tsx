type CvTimelineProps = {
  items: Array<{
    title: string
    date: string | { start: string; end: string }
    desc: string
    responsibilities?: Array<string>
  }>
}

export function CvTimeline({ items }: CvTimelineProps) {
  return (
    <div
      className="
        relative ml-[2mm] space-y-4 border-l-2 border-foreground-complementary
        pt-[1mm] pl-[4mm]
      "
    >
      {items.map((item) => (
        <div key={item.title} className="relative">
          <span
            className="
              absolute top-1 left-[calc(-4mm-var(--spacing)*2.75/2-1px)]
              box-border size-2.75 rounded-full border-2
              border-foreground-complementary bg-white
            "
          />
          <div className="mb-0.5 flex items-baseline justify-between">
            <h4
              className="
                overflow-hidden text-xs font-bold text-ellipsis
                whitespace-nowrap text-neutral-900
              "
            >
              {item.title}
            </h4>
            <span
              className="
                text-[10px] font-semibold whitespace-nowrap
                text-foreground-complementary
              "
            >
              {typeof item.date === 'string' ? (
                item.date
              ) : (
                <div
                  className="
                    flex flex-row flex-nowrap items-center justify-stretch
                    whitespace-nowrap
                  "
                >
                  <span>{item.date.start}</span>&nbsp;–&nbsp;<span>{item.date.end}</span>
                </div>
              )}
            </span>
          </div>
          <div
            className="
              mb-1.5 text-[10px] font-bold tracking-wider text-neutral-500
              uppercase
            "
          >
            {item.desc}
          </div>
          {item.responsibilities && (
            <ul
              className="
                list-disc space-y-1 pl-3 text-[10px] leading-relaxed text-pretty
                text-neutral-600
              "
            >
              {item.responsibilities.map((responsibility, index) => (
                <li key={`${responsibility}-${index}`}>{responsibility}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
