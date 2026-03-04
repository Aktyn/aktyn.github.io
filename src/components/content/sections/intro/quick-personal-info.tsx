import { differenceInYears, format } from 'date-fns'
import { CalendarHeart, CalendarRange, Languages, Map, MapPinHouse } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/common/tooltip'
import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'
import { ProjectedText } from '../../projected-text'

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
        <MapPinHouse />
        <ProjectedText text="Poland, Łódź" fontSize={14} splitWords={false} lowPriority />
        <a
          href="https://maps.app.goo.gl/HngK9DdmwfTJpXhA9"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row items-center gap-1 px-1! text-xs transition-colors hover:text-foreground-complementary hover:no-underline"
        >
          <Map className="inline size-4" />
          <ProjectedText text="Show" fontSize={14} lowPriority />
        </a>
      </QuickInfoLabel>
      <Tooltip>
        <TooltipTrigger asChild>
          <QuickInfoLabel>
            <Languages />
            <span>Polish, English</span>
          </QuickInfoLabel>
        </TooltipTrigger>
        <TooltipContent className="grid grid-cols-[auto_auto] items-center justify-center gap-x-1 text-left text-sm">
          <span>Polish:</span>
          <b>native</b>
          <span>English:</span>
          <b>C1</b>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <QuickInfoLabel>
            <CalendarRange />
            <span>{differenceInYears(new Date(), experienceStartDate)} years in the business</span>
          </QuickInfoLabel>
        </TooltipTrigger>
        <TooltipContent className="text-sm">
          <b>{format(experienceStartDate, 'dd.MM.yyyy')}</b> till now
        </TooltipContent>
      </Tooltip>
      <QuickInfoLabel>
        <CalendarHeart />
        <span>{calculateAge(new Date('1996-02-14'))} years old</span>
      </QuickInfoLabel>
    </div>
  )
}

function QuickInfoLabel(props: ComponentProps<'p'>) {
  return (
    <p
      {...props}
      className={cn(
        'flex items-center justify-center gap-x-2 text-sm font-medium whitespace-nowrap text-muted-foreground *:[svg]:aspect-square *:[svg]:size-5 *:[svg]:min-w-5',
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
