import { projectsData } from "~/lib/projects-info"
import { Sections, type SectionType } from "~/lib/sections-info"
import { ProjectsList } from "./projects-list"

type SectionViewProps = { section: SectionType }

export function SectionView({ section }: SectionViewProps) {
  const Component = Sections[section].component

  return (
    <section
      id={section}
      className="bg-background/50 w-full py-14 flex flex-col items-center justify-center"
    >
      <p className="text-lg font-light mb-4 text-balance w-192 inline-block max-w-screen px-4">
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
