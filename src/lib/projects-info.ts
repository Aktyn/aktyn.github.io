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
      images: importImages([
        import("~/img/websites/in2rp/1.webp"),
        import("~/img/websites/in2rp/2.webp"),
        import("~/img/websites/in2rp/3.webp"),
        import("~/img/websites/in2rp/4.webp"),
        import("~/img/websites/in2rp/5.webp"),
        import("~/img/websites/in2rp/6.webp"),
      ]),
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
    {
      title: "FiveM launcher",
      description:
        "It's not a website but an desktop application created with electron which allows developers to use web technologies for the UI part. FiveM is a popular GTA V modded server.",
      linkToGithubRepo: "https://github.com/Aktyn/fivem-launcher",
      images: importImages([import("~/img/websites/fivem-launcher.webp")]),
      techStack: [
        "nodejs",
        "electron",
        "typescript",
        "react",
        "sass",
        "webpack",
      ],
    },
    {
      title: "Project Paradise",
      description:
        "Just a simple website for another GTA V roleplaying server. It was just a presentation homepage with some information about the server. There was a stunning parallax effect that looked like a sunset over the ocean.",
      linkToGithubRepo: "https://github.com/Aktyn/ProjectParadise",
      images: Promise.all([
        import("~/img/websites/project-paradise.webp"),
      ]).then((modules) => modules.map((module) => module.default)),
      techStack: ["typescript", "react", "sass", "webpack"],
    },
    {
      title: "Map POI",
      description:
        "A project created as a recruiting challenge for my first job as a front-end developer. It was a simple map with POI markers loaded from given data. No map library was used in this project. All map interaction and rendering was done in code.",
      linkToGithubRepo: "https://github.com/Aktyn/React-Map-POI",
      images: importImages([
        import("~/img/websites/map-poi/1.webp"),
        import("~/img/websites/map-poi/2.webp"),
      ]),
      techStack: ["typescript", "react", "sass", "webpack"],
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

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
async function importImages(imports: Array<Promise<typeof import("*.webp")>>) {
  const modules = await Promise.all(imports)
  return modules.map((module) => module.default)
}
