import 'devicon/devicon.min.css'
import { Suspense } from 'react'
import { TechBadge } from '~/components/badges/tech-badge'
import { ScrollArea } from '~/components/common/scroll-area'
import { Separator } from '~/components/common/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/common/tooltip'
import { GithubIcon } from '~/icons/GithubIcon'
import { Section } from '~/lib/consts'
import {
  ProjectsGroup,
  useProjectsGroupsInfo,
  type ProjectsGroupInfoSchema,
} from '~/lib/projects-info'
import { cn, forceArray } from '~/lib/utils'
import { Article } from '../article'
import { ImagesStrip } from '../common/images-strip'
import { SectionContainer } from '../section-container'
import { useWindowSize } from '~/hooks/useWindowSize'
import defaultTheme from 'tailwindcss/defaultTheme'
import { useTranslation } from 'react-i18next'

const projectsGroupsArray = Object.values(ProjectsGroup)

export function Projects() {
  const projectsGroupsInfo = useProjectsGroupsInfo()

  return (
    <SectionContainer section={Section.PublicProjects}>
      {projectsGroupsArray.map((group) => (
        <Article key={group} articleKey={group}>
          <div className="-m-3 mb-0 flex flex-col items-center gap-2 bg-background/40 p-3">
            <h4 className="text-lg font-semibold">{projectsGroupsInfo[group].title}</h4>
            <p className="text-center text-sm leading-tight font-medium tracking-wide text-balance whitespace-pre-wrap text-muted-foreground">
              {projectsGroupsInfo[group].description}
            </p>
          </div>
          <div className="grid items-stretch gap-4 md:grid-cols-[repeat(auto-fit,minmax(calc(var(--spacing)*134),1fr))]">
            {projectsGroupsInfo[group].projects.map((project, _, array) => (
              <ProjectCard key={project.title} project={project} single={array.length === 1} />
            ))}
          </div>
        </Article>
      ))}
    </SectionContainer>
  )
}

type ProjectType = ProjectsGroupInfoSchema['projects'][number]

type ProjectCardProps = {
  project: ProjectType
  single?: boolean
}

function ProjectCard({ project, single }: ProjectCardProps) {
  const { width } = useWindowSize()
  const MD = parseInt(defaultTheme.screens.md) * 16
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'inline-grid grid-cols-1 gap-4 md:min-h-80 md:grid-cols-[1fr_auto]',
        !single &&
          'overflow-hidden rounded-lg border border-foreground/20 bg-background-lighter/30 p-3 not-print:shadow-lg',
      )}
    >
      <div className="flex grow flex-col items-stretch gap-4">
        <div className="flex flex-row items-center gap-2 font-semibold">
          {forceArray(project.linkToGithubRepo ?? []).map((link, _, arr) => (
            <Tooltip key={link}>
              <TooltipTrigger asChild>
                <a href={link} target="_blank" className="flex flex-row items-center gap-3">
                  <GithubIcon className="size-5 print:hidden" />
                  {arr.length === 1 && <p>{project.title}</p>}
                </a>
              </TooltipTrigger>
              <TooltipContent>{t('projects.viewOnGithub')}</TooltipContent>
            </Tooltip>
          ))}
          {forceArray(project.linkToGithubRepo ?? []).length !== 1 && <p>{project.title}</p>}
          {forceArray(project.linkToGithubRepo ?? []).map((href) => (
            <a
              key={href.toString()}
              href={href}
              target="_blank"
              className="ml-2 text-sm font-light not-print:hidden"
            >
              ({href})
            </a>
          ))}
        </div>
        <div className="text-sm tracking-wide text-pretty">{project.description}</div>
        <div className="mt-auto flex flex-row flex-wrap items-center gap-2">
          {project.techStack?.map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>
      </div>
      <Separator className="my-2 bg-foreground/20 md:hidden" />
      <ScrollArea
        type="hover"
        orientation={width < MD ? 'horizontal' : 'vertical'}
        className="-m-3 overflow-hidden contain-[size] max-md:-mt-16 max-md:h-64 max-md:**:data-radix-scroll-area-viewport:*:flex! max-md:**:data-radix-scroll-area-viewport:*:h-full md:-ml-16 md:w-76 print:in-[.hide-images-in-print]:hidden"
      >
        <div className="flex items-stretch justify-start gap-4 p-2 max-md:mx-auto max-md:h-full max-md:flex-row max-md:pt-16 md:my-auto md:w-full md:flex-col md:p-4 md:pl-16">
          <Suspense fallback={<span />}>
            <ImagesStrip images={project.images} altPrefix="project-image" />
          </Suspense>
        </div>
      </ScrollArea>
    </div>
  )
}
