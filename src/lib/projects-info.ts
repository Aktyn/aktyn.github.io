import { SectionType } from "~/lib/sections-info"

export type ProjectSchema = {
  title: string
  description: string
  tags?: string[]
  techStack?: string[]
  linkToGithubRepo?: `https://github.com/Aktyn/${string}`
  images?: string[]
}

export const projectsData: { [key in SectionType]: ProjectSchema[] } = {
  [SectionType.WebDevelopment]: [
    {
      title: "In2RP website",
      description: "Website created for ...",
      linkToGithubRepo: "https://github.com/Aktyn/in2rp_homepage",
      images: ["/projects/in2rp_1.png", "/projects/in2rp_2.png"],
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
