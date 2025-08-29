import diplomaThumbnail from "~/img/quick-access-thumbnails/diplom.webp"
import workExperienceThumbnail from "~/img/quick-access-thumbnails/linkedin.webp"
import webScraperThumbnail from "~/img/quick-access-thumbnails/web-scraper.webp"
import { Suspense, use, useState, type ComponentProps } from "react"
import type { DynamicIcon } from "lucide-react/dynamic"
import { AmbientImage } from "~/components/gallery/ambient-image"
import { RootPortal } from "~/components/portal/root-portal"
import { MaximizedGallery } from "~/components/gallery/maximized-gallery"
import { importImages } from "./utils"
import { Skeleton } from "~/components/ui/skeleton"
import { ProjectsGroup, projectsGroupsInfo } from "./projects-info"
import { ImagesStrip } from "~/components/gallery/images-strip"
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"
import { BicepsFlexed } from "lucide-react"

//TODO: remove file
// import graphicsAspirationsThumbnail from "~/img/quick-access-thumbnails/graphics-aspirations.webp"

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
    images: importImages([
      import("~/img/journey/diplom.webp"),
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
    images: importImages([]),
  },
} as const satisfies {
  [key in JourneySection]: {
    title: string
    thumbnail: string
    images: Promise<string[]>
    icon: ComponentProps<typeof DynamicIcon>["name"] | { svgPath: string }
  }
}

export const schoolTimelineItems = [
  {
    date: "May 2015",
    content: (
      <p>
        1 month of apprenticeship at <b>GE Power Controls Sp. z o.o.</b>
      </p>
    ),
  },
  {
    date: "June 2015",
    content: (
      <div className="flex flex-col items-start">
        <p>Winning a programming competition</p>
        <div className="flex flex-row flex-wrap-reverse items-center gap-x-4 gap-y-1">
          <Suspense fallback={<Skeleton className="w-32 h-48" />}>
            <Diploma />
          </Suspense>
          <span className="text-sm text-pretty grow flex-0 max-w-80">
            First Place in the Entertainment Program Category at the 15th
            National Programming Competition for Upper Secondary Schools.
          </span>
        </div>
      </div>
    ),
  },
  {
    date: "August 2016", //TODO: verify correct month on the document
    content: (
      <p>
        After graduating, I was granted a professional qualification as an{" "}
        <b>IT technician</b>{" "}
        <span className="text-sm">(Technik Informatyk)</span>
      </p>
    ),
  },
]

export const universityTimelineItems = [
  {
    date: "May 2019",
    content: (
      <div className="flex flex-col items-stretch">
        <p className="z-20">
          <a
            href="https://github.com/Aktyn/ZeroG-Ball"
            target="_blank"
            className="font-semibold"
          >
            ZeroG Ball
          </a>{" "}
          - game created as a university project
        </p>
        <CompactImagesStrip
          images={
            projectsGroupsInfo[ProjectsGroup.GameDevelopment].projects.find(
              (p) => p.title === "ZeroG Ball",
            )?.images ?? Promise.resolve([])
          }
          altPrefix="ZeroG-Ball"
        />
      </div>
    ),
  },
  {
    date: "October 2019",
    content: (
      <p className="z-30">
        This is when I started my first IT job. More info in the next section.
      </p>
    ),
  },
  {
    date: "Jan 2020",
    content: (
      <p>
        <a
          href="https://github.com/Aktyn/AsystentGlosowy"
          target="_blank"
          className="font-semibold"
        >
          Asystent głosowy
        </a>{" "}
        - another university project. This time, it was a group effort{" "}
        <BicepsFlexed className="size-4 inline" />
      </p>
    ),
  },
]

function Diploma() {
  const [openGallery, setOpenGallery] = useState(false)
  const [sourceBounds, setSourceBounds] = useState<DOMRect | null>(null)

  const diplomaSrc = use(journeyInfo[JourneySection.Education].images)[0]

  return (
    <>
      <AmbientImage
        src={diplomaSrc}
        alt="diploma"
        className="hover:scale-110 hover:z-10 transition-[scale] ease-bounce duration-bounce cursor-pointer h-48 *:max-h-48"
        ambientOpacity={0.3}
        onClick={(event) => {
          setOpenGallery(true)
          setSourceBounds(event.currentTarget.getBoundingClientRect())
        }}
      />
      <RootPortal>
        <MaximizedGallery
          open={openGallery}
          onClose={() => setOpenGallery(false)}
          sourceBounds={sourceBounds}
          images={[diplomaSrc]}
          index={0}
          onIndexChange={() => void 0}
        />
      </RootPortal>
    </>
  )
}

type CompactImagesStripProps = {
  images: Promise<string[]>
  altPrefix: string
}

export function CompactImagesStrip({
  images,
  altPrefix,
}: CompactImagesStripProps) {
  return (
    <ScrollArea className="overflow-hidden -m-4 -my-16 h-64 **:data-[slot=scroll-area-viewport]:*:max-h-full">
      <div className="flex flex-row justify-start items-stretch gap-4 p-4 pt-16 overflow-hidden mx-auto *:h-32 *:*:h-32! **:[img]:w-auto **:[img]:max-w-fit">
        <Suspense
          fallback={
            <div className="flex flex-row gap-4">
              <Skeleton className="w-52 h-32" />
              <Skeleton className="w-52 h-32" />
              <Skeleton className="w-52 h-32" />
              <Skeleton className="w-52 h-32" />
              <Skeleton className="w-52 h-32" />
            </div>
          }
        >
          <ImagesStrip images={images} altPrefix={altPrefix} />
        </Suspense>
      </div>
      <ScrollBar orientation="horizontal" className="mb-12" />
    </ScrollArea>
  )
}
