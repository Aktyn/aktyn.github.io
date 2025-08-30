import { BicepsFlexed } from "lucide-react"
import type { DynamicIcon } from "lucide-react/dynamic"
import { Suspense, use, useState, type ComponentProps } from "react"
import { AmbientImage } from "~/components/gallery/ambient-image"
import { ImagesStrip } from "~/components/gallery/images-strip"
import { MaximizedGallery } from "~/components/gallery/maximized-gallery"
import { GithubIcon } from "~/components/icons/GithubIcon"
import { LinkedInIcon } from "~/components/icons/LinkedInIcon"
import { RootPortal } from "~/components/portal/root-portal"
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"
import { Skeleton } from "~/components/ui/skeleton"
import diplomaThumbnail from "~/img/quick-access-thumbnails/diplom.webp"
import workExperienceThumbnail from "~/img/quick-access-thumbnails/linkedin.webp"
import webScraperThumbnail from "~/img/quick-access-thumbnails/web-scraper.webp"
import { ProjectsGroup, projectsGroupsInfo } from "./projects-info"
import { cn, importImages } from "./utils"

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
        <p className="z-20 font-semibold">
          <a
            href="https://github.com/Aktyn/ZeroG-Ball"
            target="_blank"
            className="underline inline-flex flex-row items-center gap-1"
          >
            <GithubIcon className="inline size-3 -my-1" />
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
          className="-ml-3"
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
      <div>
        <p className="font-semibold">
          <a
            href="https://github.com/Aktyn/AsystentGlosowy"
            target="_blank"
            className="underline inline-flex flex-row items-center gap-1"
          >
            <GithubIcon className="inline size-3 -my-1" />
            Asystent głosowy
          </a>{" "}
          - another university project. This time, it was a group effort{" "}
          <BicepsFlexed className="size-4 inline fill-foreground/25" />
        </p>
        <p className="text-sm text-pretty">
          It was a fully voice-controlled music player that could control played
          audio and manage playlists. All of this was possible with predefined
          voice commands. It was created before LLM models became popular.
        </p>
      </div>
    ),
  },
]

export const workExperienceTimelineItems = [
  {
    date: { start: "Nov 2019", end: "Aug 2021" },
    content: (
      <div className="flex flex-col items-start">
        <p className="text-balance font-semibold">
          Frontend Developer at{" "}
          <a
            href="https://www.enigma.com.pl/"
            target="_blank"
            className="underline"
          >
            Enigma Systemy Ochrony Informacji Sp. z o. o.
          </a>
        </p>
        <p className="text-sm text-pretty z-10 mb-1 mt-2">
          During the recruitment process, I was tasked with creating a small{" "}
          <i>React+TypeScript</i> project in a few days. The project was called{" "}
          <a
            href="https://github.com/Aktyn/React-Map-POI"
            target="_blank"
            className="font-semibold inline-flex flex-row items-center gap-1"
          >
            <GithubIcon className="inline size-3 -my-1" />
            React-Map-POI
          </a>
          .
        </p>
        <CompactImagesStrip
          images={
            projectsGroupsInfo[ProjectsGroup.WebDevelopment].projects.find(
              (p) => p.title === "Map POI",
            )?.images ?? Promise.resolve([])
          }
          altPrefix="React-Map-POI"
          className="min-w-full -ml-3"
        />
        <p className="mt-3 z-10 text-sm text-pretty">
          For most of the time, I was part of a team of front-end developers
          working on the project website. I gained valuable experience with
          modern web technologies.
        </p>
        <p className="text-sm z-10 text-pretty">
          As the project was coming to an end, I needed to expand my skillset
          since there was a period of time when there was no need for front-end
          developers.
          <br />
          Over the last couple of months, I have been coding{" "}
          <span className="font-semibold">PostgreSQL</span> queries, which has
          given me real-world experience with databases.
        </p>
      </div>
    ),
  },
  {
    date: { start: "Aug 2021", end: "Apr 2025" },
    content: (
      <div>
        <p className="font-semibold">
          Back to the world of Frontend Development at{" "}
          <a
            href="https://www.linkedin.com/company/night-woods/"
            target="_blank"
            className="underline inline-flex flex-row items-center gap-1"
          >
            <LinkedInIcon className="size-3" />
            Night Woods
          </a>
        </p>
        <p className="text-sm text-pretty mt-2">
          <span className="font-light">
            To avoid going into too much detail, I'll provide a brief summary.
          </span>
          <br />
          During that time, I worked on several projects. My primary focus was
          on the web front end, though I occasionally assisted with back-end and
          mobile app development.
          <br />I also spent a significant amount of time creating UI designs.
        </p>
      </div>
    ),
  },
]

export const freeTimeProjectsTimelineItems = [
  {
    date: "Games",
    content: (
      <div>
        <p>Creating games was always my ultimate career goal (still pursued)</p>
        <div className="text-sm">
          <p>
            Fortunately, game development is possible solo so throughout my life
            I turned few ideas into game projects:
            <ul>
              <li>- todo, game titles, short description and link to github</li>
            </ul>
          </p>
        </div>
      </div>
    ),
  },
  {
    date: "Websites",
    content: "TODO",
  },
  {
    date: "Genetic algorithms",
    content: "TODO",
  },
  {
    date: "Microcontrollers",
    content: "TODO",
  },
  {
    date: "Graphics",
    content: (
      <p>
        As mentioned in the education section{" "}
        <span className="text-sm">(the first one)</span>, I enjoy creating
        amateur 3D graphics in my free time.
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
  className?: string
}

export function CompactImagesStrip({
  images,
  altPrefix,
  className,
}: CompactImagesStripProps) {
  return (
    <ScrollArea
      className={cn(
        "-m-4 -my-16 h-64 **:data-[slot=scroll-area-viewport]:*:max-h-full",
        className,
      )}
    >
      <div className="overflow-hidden min-w-full flex flex-row justify-start items-stretch gap-4 p-4 pt-16 mx-auto *:h-32 *:*:h-32! **:[img]:w-auto **:[img]:max-w-fit **:[img]:first:blur-md">
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
          <ImagesStrip
            images={images}
            altPrefix={altPrefix}
            ambientOpacity={0.3}
          />
        </Suspense>
      </div>
      <ScrollBar orientation="horizontal" className="mb-12" />
    </ScrollArea>
  )
}
