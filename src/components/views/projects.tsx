import { Suspense, use, useState } from "react"
import { ProjectsGroup, projectsGroupsInfo } from "~/lib/projects-info"
import { ScrollArea } from "~/components/ui/scroll-area"
import { cn, forceArray } from "~/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { Button } from "~/components/ui/button"
import { GithubIcon } from "~/components/icons/GithubIcon"
import { techStack } from "~/lib/tech-stack"
import { Badge } from "~/components/ui/badge"
import { Skeleton } from "~/components/ui/skeleton"
import "devicon/devicon.min.css"
import { RootPortal } from "~/components/portal/root-portal"
import { MaximizedGallery } from "~/components/gallery/maximized-gallery"

export function Projects() {
  return (
    <div className="size-full min-h-full max-w-full flex flex-col items-stretch justify-start gap-y-16 p-6 pb-[25dvh]">
      {Object.values(ProjectsGroup).map((group) => {
        return <ProjectsGroupContainer key={group} group={group} />
      })}
    </div>
  )
}

function ProjectsGroupContainer({ group }: { group: ProjectsGroup }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="glass-card flex flex-col items-center gap-4">
        <h4 className="text-base font-semibold">
          {projectsGroupsInfo[group].title}
        </h4>
        <p className="text-sm leading-tight tracking-wide whitespace-pre-wrap text-balance text-center text-[color-mix(in_oklab,_var(--color-foreground)_80%,_var(--color-background))]">
          {projectsGroupsInfo[group].description}
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(calc(var(--spacing)*112),1fr))] items-stretch gap-4">
        {projectsGroupsInfo[group].projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  )
}

type ProjectType =
  (typeof projectsGroupsInfo)[ProjectsGroup]["projects"][number]

function ProjectCard({ project }: { project: ProjectType }) {
  return (
    <div className="inline-grid grid-cols-[1fr_auto] gap-4 p-4 bg-accent/20 backdrop-blur-sm border rounded-lg overflow-hidden min-h-80">
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
            <Badge
              key={tech}
              dir="ltr"
              variant="outline"
              className="text-sm gap-x-2 p-1 px-2 rounded-md bg-background/50 relative"
            >
              <i
                className={cn(
                  techStack[tech].icon,
                  "absolute left-2 inset-y-auto blur-md",
                )}
              />
              <i
                className={cn(
                  techStack[tech].icon,
                  "drop-shadow-[0_0_calc(var(--spacing)*0.5)_#000]",
                )}
              />
              <span className="leading-none">{techStack[tech].name}</span>
            </Badge>
          ))}
        </div>
      </div>
      <ScrollArea className="overflow-hidden contain-[size] w-96 -m-4 -ml-36 ">
        <div className="flex flex-col justify-start items-stretch w-full gap-4 p-4 pl-36 my-auto">
          <Suspense
            fallback={
              <>
                <Skeleton className="w-full aspect-4/3" />
                <Skeleton className="w-full aspect-4/3" />
              </>
            }
          >
            <ImagesStrip images={project.images} />
          </Suspense>
        </div>
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
          className="relative hover:scale-110 hover:z-10 transition-[scale] ease-bounce duration-bounce cursor-pointer"
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
            className="absolute inset-0 blur-lg scale-110 opacity-50 -z-1 pointer-events-none"
          />
          <img
            alt={`project-image-${index}`}
            src={image}
            loading="lazy"
            className="w-full max-w-full h-auto rounded-md"
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
