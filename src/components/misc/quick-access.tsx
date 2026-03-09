import { type ComponentProps } from 'react'
import { Section, sectionData } from '~/lib/consts'
import { cn } from '~/lib/utils'
import { ProjectedText } from '../content/projected-elements/projected-text'
import { materialSymbolIcons, materialSymbolProps } from '~/icons/material-symbol-icons'

export function QuickAccess(props: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('flex w-full max-w-screen flex-col items-center px-4', props.className)}
    >
      {/* Zawartość strony */}
      <h5 data-entry-animation-type="zoom-in" className="text-sm font-medium text-muted-foreground">
        Site content
      </h5>
      <div className="grid max-w-384 grid-cols-1 items-center justify-center gap-y-4 lg:grid-cols-3">
        {Object.values(Section).map(
          (section) => section !== Section.Intro && <SectionLink key={section} section={section} />,
        )}
      </div>
    </div>
  )
}

function SectionLink({ section }: { section: Section }) {
  return (
    <a
      href={`#${section}`}
      data-entry-animation
      className="relative inline text-center font-semibold hover:*:last:translate-y-0 hover:*:last:scale-100 hover:*:last:opacity-100 *:[span]:transition-colors hover:*:[span]:text-foreground-complementary"
    >
      <ProjectedText
        text={sectionData[section].extendedTitle}
        as="span"
        fontSize={20}
        fontWeight="semibold"
      />
      <div className="absolute inset-x-0 -bottom-5 flex -translate-y-5 scale-golden-inverse justify-center gap-x-1 text-sm font-normal text-foreground opacity-0 transition-[opacity,scale,translate]">
        <svg viewBox={materialSymbolProps.viewBox} className="size-5">
          <path d={materialSymbolIcons.WebTraffic} />
        </svg>
        <span>Let's go</span>
      </div>
    </a>
  )
}
