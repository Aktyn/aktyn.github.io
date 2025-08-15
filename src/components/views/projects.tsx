import { Suspense, use, useMemo, useState } from "react"
import { ProjectsGroup, projectsGroupsInfo } from "~/lib/projects-info"
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"
import { forceArray } from "~/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { Button } from "~/components/ui/button"
import { GithubIcon } from "~/components/icons/GithubIcon"
import { RootPortal } from "~/components/portal/root-portal"
import { MaximizedGallery } from "~/components/gallery/maximized-gallery"
import { ViewModule } from "~/modules/view.module"
import { ScreenEdgeButton } from "~/components/buttons/ScreenEdgeButton"
import "devicon/devicon.min.css"
import { TechBadge } from "~/components/badges/tech-badge"
import { Separator } from "~/components/ui/separator"

const DELAY_BASE = 150
const projectsGroupsArray = Object.values(ProjectsGroup)

export function Projects() {
  const { setView, viewChangeDirection } = ViewModule.useView()

  const delays = useMemo(() => {
    const reverse = viewChangeDirection === -1

    let acc = 0
    const mapped = (
      reverse ? [...projectsGroupsArray].reverse() : projectsGroupsArray
    ).map((group) => {
      const duration =
        (projectsGroupsInfo[group].projects.length + 1) * DELAY_BASE
      const prevAcc = acc
      acc += duration
      return prevAcc
    })

    return reverse ? mapped.reverse() : mapped
  }, [viewChangeDirection])

  return (
    <div className="size-full min-h-full max-w-full flex flex-col items-stretch justify-start gap-y-16 p-6">
      {projectsGroupsArray.map((group, index) => {
        return (
          <ProjectsGroupContainer
            key={group}
            group={group}
            delay={delays[index]}
          />
        )
      })}
      <ScreenEdgeButton
        className="mt-[25dvh]"
        onClick={() => setView(ViewModule.View.MyJourney)}
      >
        Next view
      </ScreenEdgeButton>
    </div>
  )
}

type ProjectsGroupContainerProps = {
  group: ProjectsGroup
  /** Delay in milliseconds */
  delay: number
}

function ProjectsGroupContainer({ group, delay }: ProjectsGroupContainerProps) {
  const { viewChangeDirection } = ViewModule.useView()

  const reverse = viewChangeDirection === -1

  return (
    <div className="flex flex-col gap-4">
      <div
        className="view-transition-base glass-card flex flex-col items-center gap-4"
        style={{
          animationDelay: `${reverse ? delay + projectsGroupsInfo[group].projects.length * DELAY_BASE : delay}ms`,
        }}
      >
        <h4 className="text-base font-semibold">
          {projectsGroupsInfo[group].title}
        </h4>
        <p className="text-sm leading-tight tracking-wide whitespace-pre-wrap text-balance text-center text-[color-mix(in_oklab,_var(--color-foreground)_80%,_var(--color-background))]">
          {projectsGroupsInfo[group].description}
        </p>
      </div>
      <div className="grid md:grid-cols-[repeat(auto-fit,_minmax(calc(var(--spacing)*112),1fr))] items-stretch gap-4">
        {projectsGroupsInfo[group].projects.map((project, index, arr) => (
          <ProjectCard
            key={project.title}
            project={project}
            delay={
              delay +
              (reverse ? arr.length - 1 - index : index + 1) * DELAY_BASE
            }
          />
        ))}
      </div>
    </div>
  )
}

type ProjectType =
  (typeof projectsGroupsInfo)[ProjectsGroup]["projects"][number]

type ProjectCardProps = {
  project: ProjectType
  /** Delay in milliseconds */
  delay: number
}

function ProjectCard({ project, delay }: ProjectCardProps) {
  return (
    <div
      className="view-transition-base inline-grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 p-4 bg-accent/20 backdrop-blur-sm border rounded-lg overflow-hidden md:min-h-80"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-stretch gap-4 grow">
        <div className="grid grid-cols-[auto_1fr] justify-start items-center gap-x-4">
          {!!project.linkToGithubRepo?.length && (
            <div className="flex flex-row items-center gap-2">
              {forceArray(project.linkToGithubRepo ?? []).map((link) => (
                <Tooltip key={link}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      size="icon"
                      variant="ghost"
                      className="hover:text-primary rounded-full p-2 size-auto"
                    >
                      <a href={link} target="_blank">
                        <GithubIcon className="size-5" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View on GitHub</TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}
          <p className="font-semibold">{project.title}</p>
        </div>
        <div className="text-pretty text-sm tracking-wide">
          {project.description}
        </div>
        <div className="flex flex-row flex-wrap items-center gap-2 mt-auto">
          {project.techStack?.map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>
      </div>
      <Separator className="md:hidden" />
      <ScrollArea className="overflow-hidden contain-[size] md:w-96 -m-4 md:-ml-36 max-md:h-64 max-md:**:data-[slot=scroll-area-viewport]:*:max-h-full max-md:-mt-16">
        <div className="flex md:flex-col max-md:flex-row justify-start items-stretch md:w-full gap-4 p-2 md:p-4 md:pl-36 max-md:h-full max-md:mx-auto md:my-auto max-md:pt-16">
          <Suspense fallback={<span />}>
            <ImagesStrip images={project.images} />
          </Suspense>
        </div>
        <ScrollBar orientation="horizontal" className="md:hidden" />
      </ScrollArea>
    </div>
  )
}

function ImagesStrip({ images: imagesPromise }: { images: Promise<string[]> }) {
  const images = use(imagesPromise)

  const [openGallery, setOpenGallery] = useState(false)
  const [sourceBounds, setSourceBounds] = useState<DOMRect | null>(null)
  const [focusImageIndex, setFocusImageIndex] = useState(-1)

  return (
    <>
      {images.map((image, index) => (
        <div
          key={image}
          className="relative hover:scale-110 hover:z-10 transition-[scale] ease-bounce duration-bounce cursor-pointer *:animate-in *:fade-in *:fill-mode-both *:duration-500 max-md:max-h-46"
          onClick={(event) => {
            setOpenGallery(true)
            setSourceBounds(event.currentTarget.getBoundingClientRect())
            setFocusImageIndex(index)
          }}
        >
          <img
            alt={`project-image-${index}-blur`}
            src={image}
            loading="lazy"
            className="absolute inset-0 blur-lg scale-110 h-full opacity-50 -z-1 pointer-events-none"
          />
          <img
            alt={`project-image-${index}`}
            src={image}
            loading="lazy"
            className="md:w-full max-w-fit md:max-w-full h-full md:h-auto max-md:max-h-full rounded-md"
          />
        </div>
      ))}
      {focusImageIndex !== -1 && (
        <RootPortal>
          <MaximizedGallery
            open={openGallery}
            onClose={() => setOpenGallery(false)}
            sourceBounds={sourceBounds}
            images={images}
            index={focusImageIndex}
            onIndexChange={setFocusImageIndex}
          />
        </RootPortal>
      )}
    </>
  )
}
