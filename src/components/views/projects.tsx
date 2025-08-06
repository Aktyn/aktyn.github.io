import { Fragment } from "react"
import { Separator } from "~/components/ui/separator"
import { ProjectsGroup, projectsGroupsInfo } from "~/lib/projects-info"

export function Projects() {
  return (
    <div className="size-full min-h-full max-w-full flex flex-col items-center justify-start gap-y-8 p-6">
      {Object.values(ProjectsGroup).map((group, index) => {
        return (
          <Fragment key={group}>
            {index > 0 && (
              <Separator className="mask-linear-[to_right,transparent,black,transparent]" />
            )}
            <ProjectsGroupContainer group={group} />
          </Fragment>
        )
      })}
    </div>
  )
}

function ProjectsGroupContainer({ group }: { group: ProjectsGroup }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="glass-card text-base font-medium tracking-wide whitespace-pre-wrap text-balance text-center">
        {projectsGroupsInfo[group].description}
      </h4>
      {projectsGroupsInfo[group].projects.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </div>
  )
}

type ProjectType =
  (typeof projectsGroupsInfo)[ProjectsGroup]["projects"][number]

function ProjectCard({ project }: { project: ProjectType }) {
  return <div>{project.title}</div>
}
