import type { DynamicIcon } from "lucide-react/dynamic"
import { type ComponentProps } from "react"
import diplomaThumbnail from "~/img/quick-access-thumbnails/diploma.webp"
import workExperienceThumbnail from "~/img/quick-access-thumbnails/linkedin.webp"
import webScraperThumbnail from "~/img/quick-access-thumbnails/web-scraper.webp"
import { importImages } from "./utils"

export enum JourneySection {
  Education = "education",
  WorkExperience = "work-experience",
  FreeTimeProjects = "free-time-projects",
}

export const journeyInfo = {
  [JourneySection.Education]: {
    title: "Education",
    thumbnail: diplomaThumbnail,
    icon: "graduation-cap",
    images: importImages([
      import("~/img/journey/diploma.webp"),
      // --------------------------------------------------
      import("~/img/computer-graphics/table-tennis.webp"),
      import("~/img/computer-graphics/psyduck.webp"),
      import("~/img/computer-graphics/fafik_2.webp"),
      import("~/img/computer-graphics/old_ball.webp"),
      import("~/img/computer-graphics/hairy-logo-v1-postprocess.webp"),
      import("~/img/computer-graphics/neon_logo_wallpaper.webp"),
      import("~/img/computer-graphics/sniadanko.webp"),
    ]),
  },
  [JourneySection.WorkExperience]: {
    title: "Work experience",
    thumbnail: workExperienceThumbnail,
    icon: "briefcase",
    images: importImages([]),
  },
  [JourneySection.FreeTimeProjects]: {
    title: "Free time projects",
    thumbnail: webScraperThumbnail,
    icon: "user-star",
    images: importImages([import("~/img/journey/graphics-aspirations.webp")]),
  },
} as const satisfies {
  [key in JourneySection]: {
    title: string
    thumbnail: string
    images: Promise<string[]>
    icon: ComponentProps<typeof DynamicIcon>["name"] | { svgPath: string }
  }
}
