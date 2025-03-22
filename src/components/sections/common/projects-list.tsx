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
import { techStack } from "~/lib/tech-stack"
import { cn, forceArray } from "~/lib/utils"

type ProjectsListProps = {
  projects: ProjectSchema[]
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const firstFlippedIndex: 0 | 1 = 1

  return (
    <div className="flex flex-col gap-4 w-full">
      {projects.map((project, index) => (
        <div
          key={project.title}
          dir={index % 2 === firstFlippedIndex ? "rtl" : "ltr"}
          className={cn(
            "view-based-animation",
            index % 2 === firstFlippedIndex
              ? "slide-in-from-right"
              : "slide-in-from-left",
            "grid grid-cols-2 max-lg:grid-cols-1 items-center justify-stretch *:first:justify-self-stretch *:last:justify-self-start max-lg:min-xs:*:last:justify-self-center gap-x-16 max-lg:pr-0 max-lg:gap-x-8 max-lg:mx-4 max-lg:*:first:row-start-2 max-lg:*:last:row-start-1 bg-background/20 rounded-2xl border mx-auto w-[calc(100%-var(--spacing)*8)] max-w-full backdrop-blur-sm overflow-hidden shadow-xl",
            index % 2 === firstFlippedIndex ? "pl-8" : "pr-8",
          )}
        >
          <Suspense fallback={<div>...</div>}>
            <Gallery
              images={project.images}
              rtl={index % 2 === firstFlippedIndex}
            />
          </Suspense>
          <div className="flex flex-col items-start max-lg:items-center gap-y-4 z-10 px-4 max-lg:p-4 max-lg:-mb-44 max-w-160">
            <div className="flex flex-row items-center justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-wide">
                {project.title}
              </h3>
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
                        <Github className="size-6" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View on GitHub</TooltipContent>
                </Tooltip>
              ))}
            </div>
            <p
              dir="ltr"
              className="text-balance font-medium lg:text-left rtl:lg:text-right leading-relaxed drop-shadow-[0_0_2px_#000a] whitespace-pre-wrap"
            >
              {project.description}
            </p>
            {!!project.techStack?.length && (
              <div className="flex flex-row flex-wrap items-center max-lg:justify-center gap-2 **:[i]:text-xl *:text-base *:gap-x-2 *:p-1 *:px-3 *:rounded-lg *:bg-background/50 *:relative">
                {project.techStack.map((tech) => (
                  <Badge key={tech} dir="ltr" variant="outline">
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
        </div>
      ))}
    </div>
  )
}
