import { type ReactNode, type ComponentProps } from 'react'
import { Badge } from '~/components/common/badge'
import { Separator } from '~/components/common/separator'
import { TreeTimeline } from '~/components/content/sections/journey/tree-timeline'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { Section } from '~/lib/consts'
import { cn } from '~/lib/utils'
import {
  useFreeTimeProjectsTimelineItems,
  useSchoolTimelineItems,
  useUniversityTimelineItems,
  useWorkExperienceTimelineItems,
} from './timeline-items'
import { journeyInfo, JourneySection } from '~/lib/journey-info'
import { CompactImagesStrip } from './compact-images-strip'
import { SectionContainer } from '../section-container'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/common/tooltip'
import { Article } from '../article'
import { GithubIcon } from '~/icons/GithubIcon'
import { useTranslation } from 'react-i18next'

type IntroProps = ComponentProps<'section'> & {
  ref?: React.RefObject<HTMLDivElement | null>
}

export function Journey({ ref, ...props }: IntroProps) {
  const { t } = useTranslation()
  const schoolTimelineItems = useSchoolTimelineItems()
  const universityTimelineItems = useUniversityTimelineItems()
  const workExperienceTimelineItems = useWorkExperienceTimelineItems()
  const freeTimeProjectsTimelineItems = useFreeTimeProjectsTimelineItems()

  return (
    <SectionContainer ref={ref} section={Section.MyJourney} {...props}>
      <Article articleKey={JourneySection.Education}>
        <DatedTitle
          dateStart="2012"
          dateEnd="2016"
          title={t('journey.education.title')}
          icon="School"
        />
        <TreeTimeline
          header={
            <div className="text-balance">
              {t('journey.education.header_1')}{' '}
              <b>
                <a href="http://www.warecka.edu.pl/" target="_blank">
                  {t('journey.education.header_2')}
                </a>
              </b>{' '}
              <span className="text-sm text-muted-foreground">
                {t('journey.education.header_3')}
              </span>
            </div>
          }
          items={schoolTimelineItems}
        />
        <Separator className="bg-transparent bg-linear-to-r from-transparent via-foreground/20 to-transparent" />
        <div className="flex flex-col items-stretch gap-2">
          <p className="z-10 text-sm font-medium text-pretty">
            {t('journey.education.desc_1')}
            <br />
            {t('journey.education.desc_2')}{' '}
            <a href="https://www.blender.org/" target="_blank" className="font-bold">
              {t('names.blender')}
            </a>{' '}
            {t('journey.education.desc_bind')}{' '}
            <a href="https://www.gimp.org/" target="_blank" className="font-bold">
              {t('names.gimp')}
            </a>{' '}
            {t('journey.education.desc_3')}
          </p>
          <CompactImagesStrip
            images={journeyInfo[JourneySection.Education].images.slice(1)} // get only the diploma image
            altPrefix="graphics-aspirations"
          />
        </div>
        <Separator className="my-2 bg-foreground/20" />
        <DatedTitle
          dateStart="2017"
          dateEnd="2020"
          title={t('journey.university.title')}
          className="z-10"
        />
        <TreeTimeline
          header={
            <div className="text-balance">
              {t('journey.university.header_1')}{' '}
              <b>
                <a
                  href="https://www.math.uni.lodz.pl/"
                  target="_blank"
                  className="relative z-10 cursor-pointer underline"
                >
                  {t('journey.university.header_2')}{' '}
                  <span className="text-sm font-normal">{t('journey.university.header_3')}</span>
                </a>
              </b>
            </div>
          }
          items={universityTimelineItems}
        />
      </Article>
      <Article articleKey={JourneySection.WorkExperience}>
        <DatedTitle dateStart="2019" dateEnd="2025" title={t('journey.work.title')} icon="Work" />
        <TreeTimeline
          header={
            <div className="text-balance">
              {t('journey.work.header_1')}{' '}
              <Tooltip>
                <TooltipTrigger asChild>
                  <b>
                    {t('journey.work.header_2')}
                    <SvgIcon
                      icon="Help"
                      className="inline size-3.5 align-super text-muted-foreground print:hidden"
                    />
                  </b>
                </TooltipTrigger>
                <TooltipContent className="font-semibold">
                  {t('journey.work.header_tooltip')}
                </TooltipContent>
              </Tooltip>{' '}
              {t('journey.work.header_3')}
            </div>
          }
          items={workExperienceTimelineItems}
        />
      </Article>
      <Article articleKey={JourneySection.FreeTimeProjects}>
        <DatedTitle
          dateStart={t('journey.projects.dateStart')}
          title={t('journey.projects.title')}
          icon="PersonHeart"
        />

        <TreeTimeline
          header={
            <div className="text-balance">
              <p>{t('journey.projects.desc_1')}</p>
              <p>
                {t('journey.projects.desc_2')}{' '}
                <a href="https://github.com/Aktyn?tab=repositories" target="_blank">
                  <b className="inline-flex flex-row items-baseline gap-1">
                    <GithubIcon className="-my-1 size-3" />
                    {t('names.github')}
                  </b>{' '}
                  ({t('journey.projects.link')})
                </a>
              </p>
            </div>
          }
          items={freeTimeProjectsTimelineItems}
        />
        <div className="text-sm text-muted-foreground print:hidden">
          {t('journey.projects.moreDetails')}
        </div>
      </Article>
    </SectionContainer>
  )
}

type DatedTitleProps = ComponentProps<'div'> & {
  dateStart: string
  dateEnd?: string
  title: ReactNode
  icon?: ComponentProps<typeof SvgIcon>['icon']
}

function DatedTitle({ dateStart, dateEnd, title, icon, ...divProps }: DatedTitleProps) {
  return (
    <div
      {...divProps}
      className={cn(
        'flex flex-row flex-wrap-reverse items-center gap-4 *:[svg]:size-5 *:[svg]:min-w-5 *:[svg]:text-muted-foreground',
        divProps.className,
      )}
    >
      <Badge>
        {dateStart}
        {dateEnd ? ` - ${dateEnd}` : ''}
      </Badge>
      <span className="text-lg font-semibold">{title}</span>
      {icon && <SvgIcon icon={icon} className="ml-auto text-muted-foreground" />}
    </div>
  )
}
