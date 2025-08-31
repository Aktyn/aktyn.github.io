import type { DynamicIcon } from "lucide-react/dynamic"
import type { ComponentProps } from "react"

export enum JourneySection {
  Education = "education",
  WorkExperience = "work-experience",
  FreeTimeProjects = "free-time-projects",
}

export const journeyInfo = {
  [JourneySection.Education]: {
    title: "Education",
    thumbnail: "/img/quick-access-thumbnails/diploma.webp",
    icon: "graduation-cap",
    images: [
      "/img/journey/diploma.webp",
      // --------------------------------------------------
      "/img/computer-graphics/table-tennis.webp",
      "/img/computer-graphics/psyduck.webp",
      "/img/computer-graphics/fafik_2.webp",
      "/img/computer-graphics/old_ball.webp",
      "/img/computer-graphics/hairy-logo-v1-postprocess.webp",
      "/img/computer-graphics/neon_logo_wallpaper.webp",
      "/img/computer-graphics/sniadanko.webp",
    ],
  },
  [JourneySection.WorkExperience]: {
    title: "Work experience",
    thumbnail: "/img/quick-access-thumbnails/linkedin.webp",
    icon: "briefcase",
    images: [],
  },
  [JourneySection.FreeTimeProjects]: {
    title: "Free time projects",
    thumbnail: "/img/quick-access-thumbnails/web-scraper.webp",
    icon: "user-star",
    images: ["/img/journey/graphics-aspirations.webp"],
  },
} as const satisfies {
  [key in JourneySection]: {
    title: string
    thumbnail: string
    images: string[]
    icon: ComponentProps<typeof DynamicIcon>["name"] | { svgPath: string }
  }
}
