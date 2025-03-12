import { SectionType } from "~/lib/sections-info"
import { type techStack } from "./tech-stack"

export type ProjectSchema = {
  title: string
  description: string
  linkToGithubRepo?: `https://github.com/Aktyn/${string}`
  images: Promise<string[]>
  techStack?: Array<keyof typeof techStack>
}

export const projectsData: { [key in SectionType]: ProjectSchema[] } = {
  [SectionType.WebDevelopment]: [
    {
      title: "In2RP website",
      description:
        "Website created for GTA V role play server. It was integrated with discord bot and discord server dedicated to the GTA V role play community. Project had also database for storing server statistics and user data.",
      linkToGithubRepo: "https://github.com/Aktyn/in2rp_homepage",
      images: Promise.all([
        import("~/img/websites/in2rp/1.webp"),
        import("~/img/websites/in2rp/2.webp"),
        import("~/img/websites/in2rp/3.webp"),
        import("~/img/websites/in2rp/4.webp"),
        import("~/img/websites/in2rp/5.webp"),
        import("~/img/websites/in2rp/6.webp"),
      ]).then((modules) => modules.map((module) => module.default)),
      techStack: [
        "typescript",
        "react",
        "sass",
        "webpack",
        "express",
        "mysql",
        "discordjs",
      ],
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
