import { BicepsFlexed } from "lucide-react"
import { Suspense } from "react"
import { LinkedInIcon } from "~/components/icons/LinkedInIcon"
import { Skeleton } from "~/components/ui/skeleton"
import { projectsGroupsInfo, ProjectsGroup } from "~/lib/projects-info"
import { Diploma, GraphicsAspirations } from "./common"
import { CompactImagesStrip } from "./compact-images-strip"
import { QuickProjectInfo } from "./quick-project-info"
import { GithubProjectLink } from "~/components/common/github-project-link"

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
        <div className="z-20 font-semibold">
          <GithubProjectLink
            title="ZeroG Ball"
            href="https://github.com/Aktyn/ZeroG-Ball"
          />{" "}
          <span>- game created as a university project</span>
        </div>
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
        <p className="font-semibold text-balance">
          <GithubProjectLink
            href="https://github.com/Aktyn/AsystentGlosowy"
            title="Asystent głosowy"
          />{" "}
          <span>
            - another university project. This time, it was a group effort{" "}
          </span>
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
        <p className="text-sm text-pretty z-10 mb-1">
          During the recruitment process, I was tasked with creating a small{" "}
          <i>React+TypeScript</i> project in a few days. The project was called{" "}
          <GithubProjectLink
            href="https://github.com/Aktyn/React-Map-POI"
            title="React-Map-POI"
            className="inline-flex flex-row items-center gap-1"
          />
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
        <p className="mt-4 z-10 text-sm text-pretty">
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
        <p className="text-sm text-pretty">
          <span className="font-light">
            To avoid going into too much detail, I'll provide a brief summary.
          </span>
          <br />
          During that time, I worked on several projects. My primary focus was
          on the web front end, though I occasionally assisted with{" "}
          <u>back-end</u> and <u>mobile</u> app development.
          <br />I also spent a significant amount of time creating{" "}
          <u>UI designs</u> (mostly in{" "}
          <span className="font-semibold">Figma</span>).
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
        <p>
          Creating games was always my ultimate career goal{" "}
          <span className="text-sm text-muted-foreground">(still pursued)</span>
        </p>
        <div>
          <div>
            <p className="text-sm">
              Fortunately, game development is possible solo so throughout my
              life I've turned a few ideas into game projects.
            </p>
            <ul className="*:ml-2">
              <QuickProjectInfo
                component="li"
                githubLink="https://github.com/Aktyn/BertaSnakes"
                title="Berta Snakes"
                description="My biggest game project so far. Multiplayer browser game with WebGL based graphics, custom shaders and very unique custom physics engine."
                className="text-pretty"
              />
              <QuickProjectInfo
                component="li"
                githubLink="https://github.com/Aktyn/ZeroG-Ball"
                title="ZeroG Ball"
                description="2D game with svg based graphics physics engine build from scratch."
              />
              <QuickProjectInfo
                component="li"
                githubLink="https://github.com/Aktyn/Ten-tac-toe"
                title="Ten tac toe"
                description="Mini project - a multiplayer game working without a server, based on peer-to-peer (p2p) communication."
              />
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    date: "Web apps",
    content: (
      <div>
        <p>
          Before I was employed as a front-end developer, I created a few
          websites as a freelancer. I also worked on some full-stack projects
          for personal use, which I've included in the list below.
        </p>
        <ul className="*:ml-2">
          <QuickProjectInfo
            component="li"
            githubLink="https://github.com/Aktyn/in2rp_homepage"
            title="In2rp"
            description="Homepage created for a GTA V role-play server. The site was integrated with a Discord bot and the server database."
          />
          <QuickProjectInfo
            component="li"
            githubLink="https://github.com/Aktyn/ProjectParadise"
            title="Project Paradise"
            description="Another homepage for different GTA V role-play server."
          />
          <QuickProjectInfo
            component="li"
            githubLink="https://github.com/Aktyn/web-scraper"
            title="Web Scraper"
            description="Highly customizable web scraper with experimental AI features and CLI"
          />
        </ul>
      </div>
    ),
  },
  {
    date: "Genetic algorithms",
    content: (
      <div>
        <p>
          I have always been fascinated by the idea of a program that can evolve
          and improve over time
        </p>
        <ul className="*:ml-2">
          <QuickProjectInfo
            component="li"
            githubLink="https://github.com/Aktyn/Genetic-Algorithm"
            title="Genetic Algorithm"
            description="Experiments with a neural network evolving with a genetic algorithm. All coded from scratch"
          />
        </ul>
      </div>
    ),
  },
  {
    date: "Microcontrollers",
    content: (
      <div>
        <p>
          My most recent hobby that started when I bought my first{" "}
          <a
            href="https://www.raspberrypi.com/"
            target="_blank"
            className="font-semibold underline"
          >
            Raspberry Pi
          </a>
        </p>
        <ul className="*:ml-2">
          <QuickProjectInfo
            component="li"
            githubLink="https://github.com/Aktyn/aktyn-drone"
            title="Drone"
            description={`Custom-built drone that is connected to a Raspberry Pi, which enables all kinds of behaviors and custom routines.\nThe drone is also connected to a camera and a mobile network dongle, which allows for steering and a real-time video stream from almost any distance.`}
            className="text-pretty"
          />
          <QuickProjectInfo
            component="li"
            githubLink="https://github.com/Aktyn/Bike-Tour-Assistant"
            title="Bike tour assistant"
            description={`Raspberry Pi with a little LCD screen attached to my bike that displays current speed and mini navigation.\nCooperates with mobile app for route planning and GPS tracking.`}
            className="text-pretty"
          />
        </ul>
      </div>
    ),
  },
  {
    date: "Graphics",
    content: (
      <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-1">
        <div className="text-sm text-pretty grow flex-0">
          <p>
            As mentioned in the education section{" "}
            <span className="text-sm">(the first one)</span>, I enjoy creating
            amateur 3D graphics in my free time.
          </p>
          <p>
            When developing games, I often use my graphics-related abilities to
            create custom models and textures.
          </p>
          <ul className="*:ml-2 mt-2">
            <QuickProjectInfo
              githubLink="https://github.com/Aktyn/Blender-portfolio"
              title="My Blender renders"
            />
          </ul>
        </div>
        <Suspense fallback={<Skeleton className="w-58 h-32" />}>
          <GraphicsAspirations />
        </Suspense>
      </div>
    ),
  },
]
