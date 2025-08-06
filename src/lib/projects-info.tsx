import type { DynamicIcon } from "lucide-react/dynamic"
import type { ComponentProps, ReactNode } from "react"
import { raspberryPiIconPath } from "./consts"
import webDevThumbnail from "~/img/quick-access-thumbnails/web-dev.webp"
import gameDevThumbnail from "~/img/quick-access-thumbnails/game-dev.webp"
import computerGraphicsThumbnail from "~/img/quick-access-thumbnails/computer-graphics.webp"
import raspberrypiThumbnail from "~/img/quick-access-thumbnails/raspberrypi.webp"
import type { techStack } from "~/lib/tech-stack"
import { Button } from "~/components/ui/button"
import type { ExtendArray } from "~/lib/types"

export enum ProjectsGroup {
  WebDevelopment = "web-development",
  GameDevelopment = "game-development",
  ComputerGraphics = "computer-graphics",
  RaspberryPi = "raspberry-pi",
}

type ProjectSchema = {
  title: string
  description: ReactNode
  linkToGithubRepo?: ExtendArray<`https://github.com/Aktyn/${string}`>
  images: Promise<string[]>
  techStack?: Array<keyof typeof techStack>
}

type ProjectsGroupInfoSchema = {
  title: string
  thumbnail: string
  description: string
  icon: ComponentProps<typeof DynamicIcon>["name"] | { svgPath: string }
  projects: Array<ProjectSchema>
}

export const projectsGroupsInfo: {
  [key in ProjectsGroup]: ProjectsGroupInfoSchema
} = {
  [ProjectsGroup.WebDevelopment]: {
    title: "Web development",
    thumbnail: webDevThumbnail,
    description:
      "These are projects that I did in my free time.\n\nI only want to share projects that I completed independently, so I'm not including work projects, as they are team efforts and don't accurately reflect my individual skills.\n\nPlease note that some of the projects listed on this page are outdated and based on obsolete technologies.\nThe tech stack I'm familiar with today is quite different and more modern.",
    icon: "globe",
    projects: [
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
  },
  [ProjectsGroup.GameDevelopment]: {
    title: "Game development",
    thumbnail: gameDevThumbnail,
    description:
      "I've always wanted to make games.\nBelow are some examples of games I've made in my spare time.",
    icon: "gamepad",
    projects: [
      {
        title: "Berta Snakes",
        description:
          "My biggest game project. Multiplayer browser game with custom graphics engine, advanced GLSL shaders and a very unique physics engine that basically allows any image with a transparent background to be used as an interactive game object that can be destroyed and painted over.\nSome other features are paypal integration, real-time chat between players, ranking system, in-game currency with interactive shop and much more.",
        linkToGithubRepo: "https://github.com/Aktyn/BertaSnakes",
        images: importImages([
          import("~/img/games/berta-snakes/1.webp"),
          import("~/img/games/berta-snakes/2.webp"),
          import("~/img/games/berta-snakes/3.webp"),
          import("~/img/games/berta-snakes/4.webp"),
          import("~/img/games/berta-snakes/5.webp"),
        ]),
        techStack: [
          "typescript",
          "react",
          "sass",
          "webpack",
          "express",
          "mongodb",
        ],
      },
      {
        title: "Kulka w tarapatach",
        description:
          "I made my first game in high school for a nationwide competition. Winning the competition gave me the confidence to pursue a career as a software developer.\n\nTextures and all game assets were also made by me.",
        linkToGithubRepo: "https://github.com/Aktyn/kulka-w-tarapatach",
        images: importImages([
          import("~/img/games/kulka-w-tarapatach/1.webp"),
          import("~/img/games/kulka-w-tarapatach/2.webp"),
          import("~/img/games/kulka-w-tarapatach/3.webp"),
          import("~/img/games/kulka-w-tarapatach/4.webp"),
          import("~/img/games/kulka-w-tarapatach/5.webp"),
        ]),
        techStack: ["java", "opengl"],
      },
      {
        title: "Astro kulka",
        description:
          "My second game written in java and opengl. Made one year after Kulka w tarapatach. It has 3D graphics with custom GLSL shaders, 2D physics engine and advanced particles system.\nThere is also a map creator built in the game.",
        images: importImages([import("~/img/games/astro-kulka.webp")]),
        techStack: ["java", "opengl"],
      },
      {
        title: "Tetris widget",
        description:
          "It was more of a code challenge than game development. It's 700 lines of javascript code that anyone can paste and run in their browser console to see the game appear on top of existing content. It should work on any website. The idea was to include it as an easter egg in other of my projects.",
        linkToGithubRepo: "https://github.com/Aktyn/Tetris-widget",
        images: importImages([import("~/img/games/tetris.webp")]),
        techStack: ["javascript", "typescript"],
      },
      {
        title: "Ten tac toe",
        description: (
          <>
            Another code challenge, this time in HTML and JavaScript. It's an
            advanced version of Tic Tac Toe.
            <br />
            The game creates a peer-to-peer connection between players and
            allows them to play against each other. It works without a server,
            all data is exchanged directly between players. Basically, an
            index.html file can be opened locally and it will still work as a
            multiplayer game.
            <br />
            <Button asChild variant="link" className="px-0">
              <a
                href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe"
                target="_blank"
              >
                Wikipedia link
              </a>
            </Button>
          </>
        ),
        linkToGithubRepo: "https://github.com/Aktyn/Ten-tac-toe",
        images: importImages([import("~/img/games/ten-tac-toe.webp")]),
        techStack: ["html", "javascript"],
      },
      {
        title: "ZeroG Ball",
        description:
          "Logic game created for university project. It's unique 2D graphics engine is based on svg. It has a 2D physics engine built from scratch, a complex map editor and it can be partially controlled by voice commands.",
        linkToGithubRepo: "https://github.com/Aktyn/ZeroG-Ball",
        images: importImages([
          import("~/img/games/zero-g-ball/1.webp"),
          import("~/img/games/zero-g-ball/2.webp"),
          import("~/img/games/zero-g-ball/3.webp"),
          import("~/img/games/zero-g-ball/4.webp"),
          import("~/img/games/zero-g-ball/5.webp"),
        ]),
        techStack: ["javascript", "webpack", "electron"],
      },
    ],
  },
  [ProjectsGroup.ComputerGraphics]: {
    title: "Computer graphics",
    thumbnail: computerGraphicsThumbnail,
    description:
      "Computer graphics is also one of my passions that I can share here. I'm not a professional in this field, but I like to create some graphics from time to time.",
    icon: "images",
    projects: [
      {
        title: "Blender renders",
        description: (
          <>
            Blender is my software of choice for creating 3D renders. I've
            always been fascinated by photorealistic graphics, so I started
            learning techniques to create them.
            <br />I also use GIMP for creating textures or some post-processing
            of my renders.
            <br />
            Most of my renders with full quality can be found here:&ensp;
            <Button asChild variant="link" className="px-0">
              <a
                href="https://github.com/Aktyn/Blender-portfolio/tree/master/img"
                target="_blank"
              >
                &lt;link&gt;
              </a>
            </Button>
          </>
        ),
        linkToGithubRepo: "https://github.com/Aktyn/Blender-portfolio",
        images: importImages([
          import("~/img/computer-graphics/table-tennis.webp"),
          import("~/img/computer-graphics/psyduck.webp"),
          import("~/img/computer-graphics/fafik_2.webp"),
          import("~/img/computer-graphics/old_ball.webp"),
          import("~/img/computer-graphics/hairy-logo-v1-postprocess.webp"),
          import("~/img/computer-graphics/neon_logo_wallpaper.webp"),
          import("~/img/computer-graphics/sniadanko.webp"),
        ]),
        techStack: ["blender", "gimp"],
      },
    ],
  },
  [ProjectsGroup.RaspberryPi]: {
    title: "Raspberry Pi",
    thumbnail: raspberrypiThumbnail,
    description:
      "My other computer-related hobby is building things with Raspberry Pi boards.",
    icon: { svgPath: raspberryPiIconPath },
    projects: [
      {
        title: "Experimental robot",
        description:
          "Something I built to learn Raspberry PI.\nIt was a remote controlled robot on wheels with a camera streaming video to the website.",
        images: importImages([import("~/img/rpi-projects/robot.webp")]),
        techStack: ["raspberrypi", "python"],
      },
      {
        title: "Cyclocomputer",
        description:
          "First version of my bike touring project. It is an e-paper display (very power efficient) connected to a Raspberry Pi that shows some handy info like current speed, wind direction, etc. It also displays a small map with a plotted route.\nEverything is controlled and configured by a mobile app build with React Native.",
        linkToGithubRepo: [
          "https://github.com/Aktyn/Cyclocomputer-raspberry-pi-pico",
          "https://github.com/Aktyn/Cyclocomputer-mobile",
        ],
        images: importImages([
          import("~/img/rpi-projects/cyclocomputer/1.webp"),
          import("~/img/rpi-projects/cyclocomputer/2.webp"),
          import("~/img/rpi-projects/cyclocomputer/3.webp"),
        ]),
        techStack: ["raspberrypi", "python"],
      },
      {
        title: "Bike Tour Assistant",
        description:
          "New version of the Cyclocomputer project. This time it has an LCD screen and a camera that takes pictures every 500 meters.\nNote: mobile app code is on separate branch in git repository",
        linkToGithubRepo: "https://github.com/Aktyn/Bike-Tour-Assistant",
        images: importImages([
          import("~/img/rpi-projects/bike-tour-assistant/1.webp"),
          import("~/img/rpi-projects/bike-tour-assistant/2.webp"),
          import("~/img/rpi-projects/bike-tour-assistant/3.webp"),
          import("~/img/rpi-projects/bike-tour-assistant/4.webp"),
        ]),
        techStack: ["raspberrypi", "cplusplus"],
      },
      {
        title: "Aktyn drone",
        description:
          "My most ambitious project so far (not finished yet). A custom built drone controlled by Raspberry Pi via UART protocol. It is equipped with a GPS module, a raspberry pi camera and a mobile network module that allows access to the internet from almost anywhere in the world, giving the drone unlimited range.\nThere is also a web interface for controlling the drone and showing live stream from the camera and other sensors.",
        linkToGithubRepo: "https://github.com/Aktyn/aktyn-drone",
        images: importImages([
          import("~/img/rpi-projects/aktyn-drone/1.webp"),
          import("~/img/rpi-projects/aktyn-drone/ui1.webp"),
          import("~/img/rpi-projects/aktyn-drone/2.webp"),
          import("~/img/rpi-projects/aktyn-drone/ui2.webp"),
          import("~/img/rpi-projects/aktyn-drone/3.webp"),
          import("~/img/rpi-projects/aktyn-drone/4.webp"),
          import("~/img/rpi-projects/aktyn-drone/5.webp"),
          import("~/img/rpi-projects/aktyn-drone/6.webp"),
        ]),
        techStack: ["raspberrypi", "python", "typescript", "react"],
      },
    ],
  },
}

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
async function importImages(imports: Array<Promise<typeof import("*.webp")>>) {
  const modules = await Promise.all(imports)
  return modules.map((module) => module.default)
}
