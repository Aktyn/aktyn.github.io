import { projectsData } from "~/lib/projects-info"
import { Sections, type SectionType } from "~/lib/sections-info"
import { ProjectsList } from "./projects-list"

type SectionViewProps = { section: SectionType }

export function SectionView({ section }: SectionViewProps) {
  const Component = Sections[section].component

  return (
    <section
      id={section}
      className="w-full py-14 flex flex-col items-center justify-center gap-y-8 scroll-mt-16"
    >
      <p className="view-based-animation text-xl font-medium mb-4 text-balance tracking-wide w-160 max-w-screen px-4 drop-shadow-[0_0_2px_#000a]">
        {Sections[section].description}
      </p>
      {Component ? (
        <Component />
      ) : (
        <ProjectsList projects={projectsData[section]} />
      )}
    </section>
  )
}
