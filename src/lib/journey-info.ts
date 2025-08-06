import diplomaThumbnail from "~/img/quick-access-thumbnails/diplom.webp"
import workExperienceThumbnail from "~/img/quick-access-thumbnails/linkedin.webp"
import webScraperThumbnail from "~/img/quick-access-thumbnails/web-scraper.webp"
import type { ComponentProps } from "react"
import type { DynamicIcon } from "lucide-react/dynamic"

//TODO: remove file
import graphicsAspirationsThumbnail from "~/img/quick-access-thumbnails/graphics-aspirations.webp"

export enum JourneySection {
  // GraphicsAspirations = "graphics-aspirations",
  Education = "education",
  WorkExperience = "work-experience",
  FreeTimeProjects = "free-time-projects",
}

export const journeyInfo = {
  // [JourneySection.GraphicsAspirations]: {
  //   title: "Graphics aspirations",
  //   thumbnail: graphicsAspirationsThumbnail,
  //   icon: "file-image",
  // },
  [JourneySection.Education]: {
    title: "Education",
    thumbnail: diplomaThumbnail,
    icon: "graduation-cap",
  },
  [JourneySection.WorkExperience]: {
    title: "Work experience",
    thumbnail: workExperienceThumbnail,
    icon: "briefcase",
  },
  [JourneySection.FreeTimeProjects]: {
    title: "Free time projects",
    thumbnail: webScraperThumbnail,
    icon: "user-star",
  },
} as const satisfies {
  [key in JourneySection]: {
    [_: string]: unknown
    icon: ComponentProps<typeof DynamicIcon>["name"] | { svgPath: string }
  }
}
