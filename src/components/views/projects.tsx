import 'devicon/devicon.min.css'
import { Suspense, useMemo } from 'react'
import { TechBadge } from '~/components/badges/tech-badge'
import { ScrollDownButton } from '~/components/buttons/scroll-down-button'
import { GithubIcon } from '~/icons/GithubIcon'
import {
  Button,
  ScrollArea,
  ScrollBar,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/common/tooltip'
import { ProjectsGroup, projectsGroupsInfo } from '~/lib/projects-info'
import { cn, forceArray } from '~/lib/utils'
import { ViewModule } from '~/modules/view.module'
import { ImagesStrip } from '../content/sections/journey/images-strip'

const DELAY_BASE = 150
const projectsGroupsArray = Object.values(ProjectsGroup)

export function Projects() {
  const { view, setView, viewChangeDirection } = ViewModule.useView()

  const delays = useMemo(() => {
    const reverse = viewChangeDirection === -1

    let acc = 0
    const mapped = (reverse ? [...projectsGroupsArray].reverse() : projectsGroupsArray).map(
      (group) => {
        const duration = (projectsGroupsInfo[group].projects.length + 1) * DELAY_BASE
        const prevAcc = acc
        acc += duration
        return prevAcc
      },
    )

    return reverse ? mapped.reverse() : mapped
  }, [viewChangeDirection])

  return (
    <div className="flex size-full min-h-full max-w-full flex-col items-stretch justify-start gap-y-16 p-6">
      <div
        className={cn(
          'transition-[height] ease-linear',
          viewChangeDirection === -1 && view === ViewModule.View.PublicProjects
            ? 'h-[12.5dvh]'
            : 'h-0',
        )}
      />
      {projectsGroupsArray.map((group, index) => {
        return <ProjectsGroupContainer key={group} group={group} delay={delays[index]} />
      })}
      <ScrollDownButton className="mt-[25dvh]" onClick={() => setView(ViewModule.View.TechStack)}>
        Next view
      </ScrollDownButton>
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
        <h4 className="text-base font-semibold">{projectsGroupsInfo[group].title}</h4>
        <p className="text-center text-sm leading-tight tracking-wide text-balance whitespace-pre-wrap text-[color-mix(in_oklab,var(--color-foreground)_80%,var(--color-background))]">
          {projectsGroupsInfo[group].description}
        </p>
      </div>
      <div className="grid items-stretch gap-4 md:grid-cols-[repeat(auto-fit,minmax(calc(var(--spacing)*112),1fr))]">
        {projectsGroupsInfo[group].projects.map((project, index, arr) => (
          <ProjectCard
            key={project.title}
            project={project}
            delay={delay + (reverse ? arr.length - 1 - index : index + 1) * DELAY_BASE}
          />
        ))}
      </div>
    </div>
  )
}

type ProjectType = (typeof projectsGroupsInfo)[ProjectsGroup]['projects'][number]

type ProjectCardProps = {
  project: ProjectType
  /** Delay in milliseconds */
  delay: number
}

function ProjectCard({ project, delay }: ProjectCardProps) {
  return (
    <div
      className="view-transition-base glass-card-dark inline-grid grid-cols-1 gap-4 overflow-hidden p-4 md:min-h-80 md:grid-cols-[1fr_auto]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex grow flex-col items-stretch gap-4">
        <div className="grid grid-cols-[auto_1fr] items-center justify-start gap-x-4">
          {!!project.linkToGithubRepo?.length && (
            <div className="flex flex-row items-center gap-2">
              {forceArray(project.linkToGithubRepo ?? []).map((link) => (
                <Tooltip key={link}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      size="icon"
                      variant="ghost"
                      className="hover:text-primary size-auto rounded-full p-2"
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
        <div className="text-sm tracking-wide text-pretty">{project.description}</div>
        <div className="mt-auto flex flex-row flex-wrap items-center gap-2">
          {project.techStack?.map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>
      </div>
      <Separator className="md:hidden" />
      <ScrollArea className="-m-4 overflow-hidden contain-[size] max-md:-mt-16 max-md:h-64 max-md:**:data-[slot=scroll-area-viewport]:*:max-h-full md:-ml-36 md:w-96">
        <div className="flex items-stretch justify-start gap-4 p-2 max-md:mx-auto max-md:h-full max-md:flex-row max-md:pt-16 md:my-auto md:w-full md:flex-col md:p-4 md:pl-36">
          <Suspense fallback={<span />}>
            <ImagesStrip images={project.images} altPrefix="project-image" />
          </Suspense>
        </div>
        <ScrollBar orientation="horizontal" className="md:hidden" />
      </ScrollArea>
    </div>
  )
}
