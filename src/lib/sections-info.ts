import type { DynamicIcon } from "lucide-react/dynamic"
import type { ComponentProps } from "react"
import { raspberryPiIconPath } from "./consts"
import webDevThumbnail from "~/img/quick-access-thumbnails/web-dev.webp"
import gameDevThumbnail from "~/img/quick-access-thumbnails/game-dev.webp"
import computerGraphicsThumbnail from "~/img/quick-access-thumbnails/computer-graphics.webp"
import raspberrypiThumbnail from "~/img/quick-access-thumbnails/raspberrypi.webp"

export enum SectionType {
  WebDevelopment = "web-development",
  GameDevelopment = "game-development",
  ComputerGraphics = "computer-graphics",
  RaspberryPi = "raspberry-pi",
}

type SectionSchema = {
  title: string
  thumbnail: string
  description: string
  icon: ComponentProps<typeof DynamicIcon>["name"] | { svgPath: string }
}

export const Sections: { [key in SectionType]: SectionSchema } = {
  [SectionType.WebDevelopment]: {
    title: "Web development",
    thumbnail: webDevThumbnail,
    description:
      "I'm a frontend developer, although these are not my work projects, but rather something I did in my free time.\n\nNote that some of the projects listed on this page are old and based on outdated technologies.\nThe tech stack I'm working with today is quite different.",
    icon: "globe",
  },
  [SectionType.GameDevelopment]: {
    title: "Game development",
    thumbnail: gameDevThumbnail,
    description:
      "I always wanted to make games. Here are some of the projects I made in my spare time.",
    icon: "gamepad",
  },
  [SectionType.ComputerGraphics]: {
    title: "Computer graphics",
    thumbnail: computerGraphicsThumbnail,
    description:
      "Computer graphics is also one of my passions that I can share here. I'm not a professional in this field, but I like to create some graphics from time to time.",
    icon: "images",
  },
  [SectionType.RaspberryPi]: {
    title: "Raspberry Pi",
    thumbnail: raspberrypiThumbnail,
    description:
      "My other computer-related hobby is building things with Raspberry Pi boards.",
    icon: { svgPath: raspberryPiIconPath },
  },
}
