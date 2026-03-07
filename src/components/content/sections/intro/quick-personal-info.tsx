import { differenceInYears, format } from 'date-fns'
import type { ComponentProps } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/common/tooltip'
import { materialSymbolIcons, materialSymbolProps } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'
import { ProjectedIcon } from '../../projected-elements/projected-icon'
import { ProjectedText } from '../../projected-elements/projected-text'

type QuickPersonalInfoProps = {
  experienceStartDate: Date
  className?: string
}

export function QuickPersonalInfo({ experienceStartDate, className }: QuickPersonalInfoProps) {
  return (
    <div
      className={cn(
        'flex max-w-full flex-row flex-wrap items-center justify-start gap-x-8 *:flex-1',
        className,
      )}
    >
      <QuickInfoLabel>
        <ProjectedIcon
          path={materialSymbolIcons.Home}
          size={20}
          lowPriority
          {...materialSymbolProps}
        />
        <ProjectedText text="Poland, Łódź" fontSize={14} splitWords={false} lowPriority />
        <a
          href="https://maps.app.goo.gl/HngK9DdmwfTJpXhA9"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row items-center gap-1 px-1! text-xs transition-colors hover:fill-foreground-complementary hover:text-foreground-complementary hover:no-underline print:hidden"
        >
          <ProjectedIcon
            path={materialSymbolIcons.Map}
            size={14}
            lowPriority
            {...materialSymbolProps}
          />
          <ProjectedText text="Show" fontSize={12} lowPriority />
        </a>
      </QuickInfoLabel>
      <Tooltip>
        <TooltipTrigger asChild>
          <QuickInfoLabel>
            <ProjectedIcon
              path={materialSymbolIcons.Translate}
              size={20}
              lowPriority
              {...materialSymbolProps}
            />
            <ProjectedText text="Polish, English" splitWords={false} fontSize={14} lowPriority />
          </QuickInfoLabel>
        </TooltipTrigger>
        <TooltipContent className="grid grid-cols-[auto_auto] items-center justify-center gap-x-1 text-left text-sm">
          Polish:<b>native</b>
          English:<b>C1</b>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <QuickInfoLabel>
            <ProjectedIcon
              path={materialSymbolIcons.EventNote}
              size={20}
              lowPriority
              {...materialSymbolProps}
            />
            <ProjectedText
              text={`${differenceInYears(new Date(), experienceStartDate)} years in the business`}
              splitWords={false}
              fontSize={14}
              lowPriority
            />
          </QuickInfoLabel>
        </TooltipTrigger>
        <TooltipContent className="text-sm">
          <b>{format(experienceStartDate, 'dd.MM.yyyy')}</b> till now
        </TooltipContent>
      </Tooltip>
      <QuickInfoLabel>
        <ProjectedIcon
          path={materialSymbolIcons.IdCard}
          size={20}
          lowPriority
          {...materialSymbolProps}
        />
        <ProjectedText
          text={`${calculateAge(new Date('1996-02-14'))} years old`}
          splitWords={false}
          fontSize={14}
          lowPriority
        />
      </QuickInfoLabel>
    </div>
  )
}

function QuickInfoLabel(props: ComponentProps<'p'>) {
  return (
    <p
      {...props}
      className={cn(
        'flex flex-row items-center justify-center gap-x-1.5 fill-muted-foreground text-sm font-medium whitespace-nowrap text-muted-foreground *:[svg]:aspect-square *:[svg]:size-5 *:[svg]:min-w-5',
        props.className,
      )}
    />
  )
}

function calculateAge(birthDate: Date) {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
