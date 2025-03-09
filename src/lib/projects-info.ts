import { SectionType } from "~/lib/sections-info"

export type ProjectSchema = {
  title: string
  description: string
  tags?: string[]
  techStack?: string[]
  linkToGithubRepo?: `https://github.com/Aktyn/${string}`
}

export const projectsData: { [key in SectionType]: ProjectSchema[] } = {
  [SectionType.WebDevelopment]: [
    {
      title: "In2RP website",
      description: "Website created for ...",
      linkToGithubRepo: "https://github.com/Aktyn/in2rp_homepage",
    },
  ],
  [SectionType.GameDevelopment]: [
    // {
    //   ...
    // },
  ],
  [SectionType.ComputerGraphics]: [
    // {
    //    ...
    // },
  ],
  [SectionType.RaspberryPi]: [
    // {
    //    ...
    // },
  ],
}
