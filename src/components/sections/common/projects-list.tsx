import { ChevronRight, Github } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { type ProjectSchema } from "~/lib/projects-info"

type ProjectsListProps = {
  projects: ProjectSchema[]
}

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <div className="flex flex-col gap-4">
      {projects.map((project) => (
        <div key={project.title} className="grid grid-cols-2">
          <div className="bg-blue-400/10 rounded-lg p-4 flex items-center justify-center">
            gallery
          </div>
          <div className="grid grid-cols-[auto_1fr]">
            <Tooltip>
              <TooltipTrigger asChild>
                {/* TODO: (only when screen size allows horizontal placement) hide most of info panel behind right screen edge to reveal more of horizontal gallery */}
                <Button
                  variant="ghost"
                  className="h-full rounded-l-none px-1! hover:*:[svg]:translate-x-2"
                >
                  <ChevronRight className="size-8 transition-transform" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reveal more photos</TooltipContent>
            </Tooltip>
            <div className="p-4 flex flex-col gap-y-2 items-start">
              <div className="flex flex-row items-center justify-between gap-2">
                <h3 className="text-2xl font-bold">{project.title}</h3>
                {project.linkToGithubRepo && (
                  <Button asChild size="icon" variant="ghost">
                    <a href={project.linkToGithubRepo} target="_blank">
                      <Github className="size-6" />
                    </a>
                  </Button>
                )}
              </div>
              <p>{project.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
