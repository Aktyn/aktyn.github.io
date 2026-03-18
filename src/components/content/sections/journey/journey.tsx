import { type ReactNode, type ComponentProps } from 'react'
import { Badge } from '~/components/common/badge'
import { Separator } from '~/components/common/separator'
import { TreeTimeline } from '~/components/content/sections/journey/tree-timeline'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { Section } from '~/lib/consts'
import { cn } from '~/lib/utils'
import {
  freeTimeProjectsTimelineItems,
  schoolTimelineItems,
  universityTimelineItems,
  workExperienceTimelineItems,
} from './timeline-items'
import { journeyInfo, JourneySection } from '~/lib/journey-info'
import { CompactImagesStrip } from './compact-images-strip'
import { SectionContainer } from '../section-container'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/common/tooltip'
import { Article } from '../article'
import { GithubIcon } from '~/icons/GithubIcon'

type IntroProps = ComponentProps<'section'> & {
  ref?: React.RefObject<HTMLDivElement | null>
}

export function Journey({ ref, ...props }: IntroProps) {
  return (
    <SectionContainer ref={ref} section={Section.MyJourney} {...props}>
      <Article articleKey={JourneySection.Education}>
        <DatedTitle
          dateStart="2012"
          dateEnd="2016"
          title="Technical school, IT class"
          icon="School"
        />
        <TreeTimeline
          header={
            <div className="text-balance">
              I attended{' '}
              <b>
                <a href="http://www.warecka.edu.pl/" target="_blank">
                  Zespół szkół ponadgimnazjalnych imienia Marszalka Józefa Piłsudzkiego
                </a>
              </b>{' '}
              <span className="text-sm text-muted-foreground">(September 2012 - August 2016)</span>
            </div>
          }
          items={schoolTimelineItems}
        />
        <Separator className="bg-transparent bg-linear-to-r from-transparent via-foreground/20 to-transparent" />
        <div className="flex flex-col items-stretch gap-2">
          <p className="z-10 text-sm font-medium text-pretty">
            Although I was primarily interested in software development, I had another passion
            throughout my time in school: 3D graphics.
            <br />
            In my free time, I experimented with{' '}
            <a href="https://www.blender.org/" target="_blank" className="font-bold">
              Blender
            </a>{' '}
            and{' '}
            <a href="https://www.gimp.org/" target="_blank" className="font-bold">
              Gimp
            </a>{' '}
            and created various graphics.
          </p>
          <CompactImagesStrip
            images={journeyInfo[JourneySection.Education].images.slice(1)} // get only the diploma image
            altPrefix="graphics-aspirations"
          />
        </div>
        <Separator className="my-2 bg-foreground/20" />
        <DatedTitle dateStart="2017" dateEnd="2020" title="University studies" className="z-10" />
        <TreeTimeline
          header={
            <div className="text-balance">
              I studied at{' '}
              <b>
                <a
                  href="https://www.math.uni.lodz.pl/"
                  target="_blank"
                  className="relative z-10 cursor-pointer underline"
                >
                  Faculty of Mathematics and Computer Science{' '}
                  <span className="text-sm font-normal">
                    (Wydział Matematyki i Informatyki Uniwersytetu Łódzkiego)
                  </span>
                </a>
              </b>
            </div>
          }
          items={universityTimelineItems}
        />
      </Article>
      <Article articleKey={JourneySection.WorkExperience}>
        <DatedTitle
          dateStart="2019"
          dateEnd="2025"
          title="Work experience in software development"
          icon="Work"
        />
        <TreeTimeline
          header={
            <div className="text-balance">
              While I was still studying, I registered a{' '}
              <Tooltip>
                <TooltipTrigger asChild>
                  <u>
                    sole proprietorship{' '}
                    <SvgIcon icon="Help" className="inline size-3.5 text-muted-foreground" />
                  </u>
                </TooltipTrigger>
                <TooltipContent className="font-semibold">
                  Jednoosobowa działalność gospodarcza
                </TooltipContent>
              </Tooltip>{' '}
              in order to start working on B2B contracts.
            </div>
          }
          items={workExperienceTimelineItems}
        />
      </Article>
      <Article articleKey={JourneySection.FreeTimeProjects}>
        <DatedTitle
          dateStart="In my spare time"
          title="Personal and freelance projects"
          icon="PersonHeart"
        />

        <TreeTimeline
          header={
            <div className="text-balance">
              <p>
                I'll only group and shortly describe each category of projects giving few examples
                in each group.
              </p>
              <p>
                The most complete and up-to-date list can be found on my{' '}
                <a href="https://github.com/Aktyn?tab=repositories" target="_blank">
                  <b className="inline-flex flex-row items-baseline gap-1">
                    <GithubIcon className="-my-1 size-3" />
                    GitHub
                  </b>
                  : link
                </a>
              </p>
            </div>
          }
          items={freeTimeProjectsTimelineItems}
        />
        <div className="text-sm text-muted-foreground print:hidden">
          More details and images can be found in the next section
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
