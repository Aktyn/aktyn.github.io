import { differenceInYears, format } from 'date-fns'
import type { ComponentProps } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/common/tooltip'
import { materialSymbolIcons, materialSymbolProps } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'
import { ProjectedIcon } from '../../projected-elements/projected-icon'
import { ProjectedText } from '../../projected-elements/projected-text'
import { useTranslation } from 'react-i18next'
import { Separator } from '~/components/common/separator'

type QuickPersonalInfoProps = {
  experienceStartDate: Date
  birthDate: Date
  className?: string
}

export function QuickPersonalInfo({
  experienceStartDate,
  birthDate,
  className,
}: QuickPersonalInfoProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        `
          grid max-w-full grid-cols-1 items-center justify-start gap-x-4 gap-y-2
          xs:grid-cols-2 xs:gap-y-4
          md:grid-cols-4
        `,
        className,
      )}
    >
      <QuickInfoLabel data-entry-animation-type="from-left">
        <ProjectedIcon
          path={materialSymbolIcons.Home}
          size={20}
          lowPriority
          {...materialSymbolProps}
        />
        <ProjectedText
          text={t('intro.quickInfo.location')}
          fontSize={14}
          splitWords={false}
          lowPriority
        />
        <a
          href="https://maps.app.goo.gl/HngK9DdmwfTJpXhA9"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex flex-row items-center gap-1 px-1! text-xs transition-colors
            hover:fill-foreground-complementary
            hover:text-foreground-complementary hover:no-underline
          "
        >
          <ProjectedIcon
            path={materialSymbolIcons.Map}
            size={14}
            lowPriority
            {...materialSymbolProps}
          />
          <ProjectedText text={t('intro.quickInfo.showMap')} fontSize={12} lowPriority />
        </a>
      </QuickInfoLabel>
      <Tooltip>
        <TooltipTrigger asChild>
          <QuickInfoLabel data-entry-animation>
            <ProjectedIcon
              path={materialSymbolIcons.Translate}
              size={20}
              lowPriority
              {...materialSymbolProps}
            />
            <ProjectedText
              text={t('intro.quickInfo.languages')}
              splitWords={false}
              fontSize={14}
              lowPriority
            />
          </QuickInfoLabel>
        </TooltipTrigger>
        <TooltipContent
          className="
            grid grid-flow-col grid-cols-[1fr_auto_1fr] grid-rows-2 items-center
            justify-center gap-x-4 text-center text-sm
          "
        >
          <span>{t('intro.quickInfo.polish')}</span>
          <b>{t('intro.quickInfo.native')}</b>
          <Separator className="col-2 row-span-2" orientation="vertical" />
          <span>{t('intro.quickInfo.english')}</span>
          <b>{t('names.c1')}</b>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <QuickInfoLabel data-entry-animation>
            <ProjectedIcon
              path={materialSymbolIcons.EventNote}
              size={20}
              lowPriority
              {...materialSymbolProps}
            />
            <ProjectedText
              text={t('intro.quickInfo.yearsInBusiness', {
                count: differenceInYears(new Date(), experienceStartDate),
              })}
              splitWords={false}
              fontSize={14}
              lowPriority
            />
          </QuickInfoLabel>
        </TooltipTrigger>
        <TooltipContent className="text-sm">
          <b>{format(experienceStartDate, 'dd.MM.yyyy')}</b> {t('intro.quickInfo.tillNow')}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <QuickInfoLabel data-entry-animation-type="from-right">
            <ProjectedIcon
              path={materialSymbolIcons.Cake}
              size={20}
              lowPriority
              {...materialSymbolProps}
            />
            <ProjectedText
              text={t('intro.quickInfo.yearsOld', { count: calculateAge(birthDate) })}
              splitWords={false}
              fontSize={14}
              lowPriority
            />
            <span className="hidden">{format(birthDate, 'dd.MM.yyyy')}</span>
          </QuickInfoLabel>
        </TooltipTrigger>
        <TooltipContent className="text-sm">{format(birthDate, 'dd.MM.yyyy')}</TooltipContent>
      </Tooltip>
    </div>
  )
}

function QuickInfoLabel(props: ComponentProps<'p'>) {
  return (
    <p
      {...props}
      className={cn(
        `
          flex flex-row items-center justify-center gap-x-1.5
          fill-muted-foreground text-sm font-medium whitespace-nowrap
          text-muted-foreground
          *:[svg]:aspect-square *:[svg]:size-5 *:[svg]:min-w-5
        `,
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
