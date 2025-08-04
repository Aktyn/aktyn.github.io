import graphicsAspirationsThumbnail from "~/img/quick-access-thumbnails/graphics-aspirations.webp"
import diplomaThumbnail from "~/img/quick-access-thumbnails/diplom.webp"
import workExperienceThumbnail from "~/img/quick-access-thumbnails/linkedin.webp"
import webScraperThumbnail from "~/img/quick-access-thumbnails/web-scraper.webp"

export enum JourneySection {
  GraphicsAspirations = "graphics-aspirations",
  Education = "education",
  WorkExperience = "work-experience",
  FreeTimeProjects = "free-time-projects",
}

export const journeyInfo = {
  [JourneySection.GraphicsAspirations]: {
    title: "Graphics aspirations",
    thumbnail: graphicsAspirationsThumbnail,
  },
  [JourneySection.Education]: {
    title: "Education",
    thumbnail: diplomaThumbnail,
  },
  [JourneySection.WorkExperience]: {
    title: "Work experience",
    thumbnail: workExperienceThumbnail,
  },
  [JourneySection.FreeTimeProjects]: {
    title: "Free time projects",
    thumbnail: webScraperThumbnail,
  },
} as const satisfies { [key in JourneySection]: object }
