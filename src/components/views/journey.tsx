import type { ComponentProps } from "react"
import { type ReactNode } from "react"
import {
  CompactImagesStrip,
  journeyInfo,
  JourneySection,
  schoolTimelineItems,
  universityTimelineItems,
} from "~/lib/journey-info"
import { cn } from "~/lib/utils"
import { ViewModule } from "~/modules/view.module"
import { ScreenEdgeButton } from "../buttons/ScreenEdgeButton"
import { TreeTimeline } from "../misc/tree-timeline"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"

export function Journey() {
  // const { setView, viewChangeDirection } = ViewModule.useView()
  const { setView } = ViewModule.useView()

  //TODO: swap "Projects" and "Experience" sections. In "Free time projects" subsection there should be a mention of next section that is basically an expansions of "Fee time projects" - Projects

  //TODO: responsiveness

  return (
    <div className="size-full min-h-full max-w-full flex flex-col items-stretch justify-center gap-y-16 p-6">
      <section className="glass-card flex flex-col gap-2">
        <DatedTitle
          dateStart="2012"
          dateEnd="2016"
          title="Technical school, IT class"
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
        />
        <Separator className="bg-linear-to-r from-transparent via-foreground/20 to-transparent" />
        <div className="flex flex-col items-stretch gap-2">
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
            images={journeyInfo[JourneySection.Education].images.then(
              (images) => images.slice(1), //cut off diploma image
            )}
            altPrefix="graphics-aspirations"
          />
        </div>
        <Separator className="bg-foreground/20 my-2" />
        <DatedTitle
          dateStart="2017"
          dateEnd="2020"
          title="University studies"
          className="z-10"
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
        />
      </section>
      <section className="glass-card flex flex-col gap-2">
        Work experience, a few days project (Map POI) for recruitment purposes
      </section>
      <section className="glass-card flex flex-col gap-2 mb-auto">
        meanwhile 3d graphics aspirations / blender renders and free time
        projects
        <TreeTimeline
          header={<p className="text-balance">TODO - free time projects</p>}
          items={[
            {
              date: "Games",
              content: "TODO",
            },
            {
              date: "Websites",
              content: "TODO",
            },
            {
              date: "Genetic algorithms",
              content: "TODO",
            },
            {
              date: "Microcontrollers",
              content: "TODO",
            },
          ]}
        />
      </section>
      <ScreenEdgeButton
        className="mt-[25dvh]"
        onClick={() => setView(ViewModule.View.TechStack)}
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
}

function DatedTitle({
  dateStart,
  dateEnd,
  title,
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
    </div>
  )
}
