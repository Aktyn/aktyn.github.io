import { projectsData } from "~/lib/projects-info"
import { projectsGroupsInfo, type ProjectsGroup } from "~/lib/sections-info"
import { ProjectsList } from "./projects-list"

type SectionViewProps = { section: ProjectsGroup }

export function SectionView({ section }: SectionViewProps) {
  return (
    <section
      id={section}
      className="w-full max-w-screen py-14 flex flex-col items-center justify-center gap-y-8 scroll-mt-16"
    >
      <p className="view-based-animation text-xl font-medium mb-4 text-balance tracking-wide w-160 max-w-screen px-4 drop-shadow-[0_0_2px_#000a] whitespace-pre-wrap">
        {projectsGroupsInfo[section].description}
      </p>
      <ProjectsList projects={projectsData[section]} />
    </section>
  )
}
