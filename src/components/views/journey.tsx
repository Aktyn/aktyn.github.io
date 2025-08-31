import { Info } from "lucide-react"
import { DynamicIcon } from "lucide-react/dynamic"
import type { ComponentProps } from "react"
import { type ReactNode } from "react"
import { journeyInfo, JourneySection } from "~/lib/journey-info"
import { cn } from "~/lib/utils"
import { ViewModule } from "~/modules/view.module"
import { ScreenEdgeButton } from "../buttons/ScreenEdgeButton"
import { GithubIcon } from "../icons/GithubIcon"
import { CompactImagesStrip } from "../misc/journey-contents/compact-images-strip"
import {
  freeTimeProjectsTimelineItems,
  schoolTimelineItems,
  universityTimelineItems,
  workExperienceTimelineItems,
} from "../misc/journey-contents/timeline-items"
import { TreeTimeline } from "../misc/tree-timeline"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

const DELAY_BASE = 150

export function Journey() {
  const { view, setView, viewChangeDirection } = ViewModule.useView()

  //TODO: responsiveness

  const getDelayedStyle = (index: number) => ({
    animationDelay:
      viewChangeDirection === -1
        ? `${(14 - index) * DELAY_BASE}ms` //TODO: adjust 20
        : `${index * DELAY_BASE}ms`,
  })

  return (
    <div className="size-full min-h-full max-w-full flex flex-col items-stretch justify-center gap-y-8 p-6 *:[section]:zoom-in-120 *:[section]:zoom-out-80">
      <div
        className={cn(
          "transition-[height] ease-linear",
          viewChangeDirection === -1 && view === ViewModule.View.MyJourney
            ? "h-[12.5dvh]"
            : "h-[0dvh]",
        )}
      />
      <section
        className="view-transition-base glass-card overflow-hidden flex flex-col gap-2"
        style={getDelayedStyle(viewChangeDirection === -1 ? 8 : 0)}
      >
        <DatedTitle
          dateStart="2012"
          dateEnd="2016"
          title="Technical school, IT class"
          icon="graduation-cap"
          className="view-transition-base"
          style={getDelayedStyle(1)}
        />
        <TreeTimeline
          header={
            <p className="text-balance">
              I attended{" "}
              <b>
                <a href="http://www.warecka.edu.pl/" target="_blank">
                  Zespół szkół ponadgimnazjalnych imienia Marszalka Józefa
                  Piłsudzkiego
                </a>
              </b>{" "}
              <span className="text-sm text-muted-foreground">
                (September 2012 - August 2016)
              </span>
            </p>
          }
          items={schoolTimelineItems}
          className="view-transition-base"
          style={getDelayedStyle(2)}
        />
        <Separator
          className="view-transition-separator bg-linear-to-r from-transparent via-foreground/20 to-transparent"
          style={getDelayedStyle(3)}
        />
        <div
          className="view-transition-base flex flex-col items-stretch gap-2"
          style={getDelayedStyle(4)}
        >
          <p className="text-pretty text-sm z-10">
            Although I was primarily interested in software development, I had
            another passion throughout my time in school: 3D graphics.
            <br />
            In my free time, I experimented with{" "}
            <a
              href="https://www.blender.org/"
              target="_blank"
              className="font-semibold"
            >
              Blender
            </a>{" "}
            and{" "}
            <a
              href="https://www.gimp.org/"
              target="_blank"
              className="font-semibold"
            >
              Gimp
            </a>{" "}
            and created various graphics.
          </p>
          <CompactImagesStrip
            images={journeyInfo[JourneySection.Education].images.slice(1)} //cut off diploma image
            altPrefix="graphics-aspirations"
          />
        </div>
        <Separator
          className="view-transition-separator bg-foreground/20 my-2"
          style={getDelayedStyle(5)}
        />
        <DatedTitle
          dateStart="2017"
          dateEnd="2020"
          title="University studies"
          className="view-transition-base z-10"
          style={getDelayedStyle(6)}
        />
        <TreeTimeline
          header={
            <p className="text-balance">
              I studied at{" "}
              <b>
                <a href="https://www.math.uni.lodz.pl/" target="_blank">
                  Faculty of Mathematics and Computer Science{" "}
                  <span className="text-sm font-normal">
                    (Wydział Matematyki i Informatyki Uniwersytetu Łódzkiego)
                  </span>
                </a>
              </b>
            </p>
          }
          items={universityTimelineItems}
          className="view-transition-base"
          style={getDelayedStyle(7)}
        />
      </section>
      <section
        className="view-transition-base glass-card overflow-hidden flex flex-col gap-2"
        style={getDelayedStyle(viewChangeDirection === -1 ? 11 : 8)}
      >
        <DatedTitle
          dateStart="2019"
          dateEnd="2025"
          title="Work experience in software development"
          icon="briefcase"
          className="view-transition-base"
          style={getDelayedStyle(9)}
        />
        <TreeTimeline
          header={
            <p className="text-balance">
              While I was still studying, I registered a{" "}
              <Tooltip>
                <TooltipTrigger>
                  <u>
                    sole proprietorship{" "}
                    <Info className="inline size-3 text-muted-foreground" />
                  </u>
                </TooltipTrigger>
                <TooltipContent className="font-semibold">
                  Jednoosobowa działalność gospodarcza
                </TooltipContent>
              </Tooltip>{" "}
              in order to start working on B2B contracts.
            </p>
          }
          items={workExperienceTimelineItems}
          className="view-transition-base"
          style={getDelayedStyle(10)}
        />
      </section>
      <section
        className="view-transition-base glass-card overflow-hidden flex flex-col gap-2 mb-auto"
        style={getDelayedStyle(viewChangeDirection === -1 ? 14 : 11)}
      >
        <DatedTitle
          dateStart="In my spare time"
          title="Personal and freelance projects"
          icon="user-star"
          className="view-transition-base"
          style={getDelayedStyle(12)}
        />

        <TreeTimeline
          header={
            <div className="text-balance">
              <p>
                I'll only group and shortly describe each category of projects
                giving few examples in each group.
              </p>
              <p>
                The most complete and up-to-date list can be found on my{" "}
                <a
                  href="https://github.com/Aktyn?tab=repositories"
                  target="_blank"
                >
                  <b className="inline-flex flex-row items-baseline gap-1">
                    <GithubIcon className="size-3 -my-1" />
                    GitHub
                  </b>
                  : link
                </a>
              </p>
            </div>
          }
          items={freeTimeProjectsTimelineItems}
          className="view-transition-base"
          style={getDelayedStyle(12)}
        />
        <div
          className="view-transition-base text-muted-foreground"
          style={getDelayedStyle(13)}
        >
          More details and images can be found in the next view
        </div>
      </section>
      <ScreenEdgeButton
        className="mt-[25dvh]"
        onClick={() => setView(ViewModule.View.PublicProjects)}
      >
        Next view
      </ScreenEdgeButton>
    </div>
  )
}

type DatedTitleProps = ComponentProps<"div"> & {
  dateStart: string
  dateEnd?: string
  title: ReactNode
  icon?: ComponentProps<typeof DynamicIcon>["name"]
}

function DatedTitle({
  dateStart,
  dateEnd,
  title,
  icon,
  ...divProps
}: DatedTitleProps) {
  return (
    <div
      {...divProps}
      className={cn(
        "flex flex-row items-center gap-4 *:[svg]:size-5 *:[svg]:text-muted-foreground",
        divProps.className,
      )}
    >
      <Badge
        variant="outline"
        className="font-semibold border border-foreground/20 bg-foreground/5"
      >
        {dateStart}
        {dateEnd ? ` - ${dateEnd}` : ""}
      </Badge>
      <span className="font-semibold text-lg">{title}</span>
      {icon && (
        <DynamicIcon name={icon} className="ml-auto text-muted-foreground" />
      )}
    </div>
  )
}
