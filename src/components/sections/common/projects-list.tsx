import { Github } from "lucide-react"
import { Suspense } from "react"
import { Gallery } from "~/components/common/gallery"
import { Button } from "~/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { type ProjectSchema } from "~/lib/projects-info"

import "devicon/devicon.min.css"
import { Badge } from "~/components/ui/badge"
import { ScrollBar } from "~/components/ui/scroll-area"
import { techStack } from "~/lib/tech-stack"
import { cn } from "~/lib/utils"

type ProjectsListProps = {
  projects: ProjectSchema[]
}

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {projects.map((project) => (
        <div
          key={project.title}
          className="grid grid-cols-2 max-lg:grid-cols-1 items-center justify-stretch *:first:justify-self-stretch *:last:justify-self-start max-lg:min-xs:*:last:justify-self-center gap-x-16 mx-8 pr-8 max-lg:pr-0 max-lg:gap-x-8 max-lg:mx-4 max-lg:*:first:row-start-2 max-lg:*:last:row-start-1 bg-background/20 rounded-2xl border mx-auto w-[calc(100%-var(--spacing)*8)] max-w-full backdrop-blur-sm overflow-hidden shadow-xl"
        >
          <Suspense fallback={<div>...</div>}>
            <Gallery images={project.images} />
          </Suspense>
          <ScrollBar orientation="horizontal" />
          {/* <div className="grid grid-cols-[auto_1fr]">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  //TODO: (only when screen size allows horizontal placement) hide most of info panel behind right screen edge to reveal more of horizontal gallery
                  variant="ghost"
                  className="h-full rounded-l-none px-1! hover:*:[svg]:translate-x-2"
                >
                  <ChevronRight className="size-8 transition-transform" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reveal more photos</TooltipContent>
            </Tooltip> */}
          <div className="flex flex-col items-start max-lg:items-center gap-y-4 z-10 max-lg:p-4 max-lg:-mb-44 max-w-160">
            <div className="flex flex-row items-center justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-wide">
                {project.title}
              </h3>
              {project.linkToGithubRepo && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      size="icon"
                      variant="ghost"
                      className="hover:text-primary rounded-full p-2 size-auto"
                    >
                      <a href={project.linkToGithubRepo} target="_blank">
                        <Github className="size-6" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View on GitHub</TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-balance font-medium lg:text-left leading-relaxed drop-shadow-[0_0_2px_#000a]">
              {project.description}
            </p>
            {!!project.techStack?.length && (
              <div className="flex flex-row flex-wrap items-center max-lg:justify-center gap-2 **:[i]:text-xl *:text-base *:gap-x-2 *:p-1 *:px-3 *:rounded-lg *:bg-background/50 *:relative">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="outline">
                    <i
                      className={cn(
                        techStack[tech].icon,
                        "absolute left-3 inset-y-auto blur-md",
                      )}
                    />
                    <i
                      className={cn(
                        techStack[tech].icon,
                        "drop-shadow-[0_0_calc(var(--spacing)*0.5)_#000]",
                      )}
                    />
                    {techStack[tech].name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {/* </div> */}
        </div>
      ))}
    </div>
  )
}
