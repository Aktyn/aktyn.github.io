import { type DynamicIcon } from "lucide-react/dynamic"
import { type ComponentProps } from "react"
import { ComputerGraphics } from "~/components/sections/computer-graphics"
import { GameDevelopment } from "~/components/sections/game-development"
import { RaspberryPi } from "~/components/sections/raspberry-pi"
import { raspberryPiIconPath } from "./consts"

export enum SectionType {
  WebDevelopment = "web-development",
  GameDevelopment = "game-development",
  ComputerGraphics = "computer-graphics",
  RaspberryPi = "raspberry-pi",
}

type SectionSchema = {
  title: string
  description: string
  component?: React.ComponentType
  icon: ComponentProps<typeof DynamicIcon>["name"] | { svgPath: string }
}

export const Sections: { [key in SectionType]: SectionSchema } = {
  [SectionType.WebDevelopment]: {
    title: "Web development",
    description:
      "I'm a frontend developer, although these are not my work projects, but rather something I did before officially beginning my journey into the world of web development.\n\nNote that the projects listed on this page are old and based on outdated technologies. The tech stack I'm working with today is quite different.",
    icon: "globe",
  },
  [SectionType.GameDevelopment]: {
    title: "Game development",
    description:
      "I always wanted to make games. Here are some of the projects I made in my spare time.",
    component: GameDevelopment,
    icon: "gamepad",
  },
  [SectionType.ComputerGraphics]: {
    title: "Computer graphics",
    description:
      "Computer graphics is also one of my passions that I can share here. I'm not a professional in this field, but I like to create some graphics from time to time.",
    component: ComputerGraphics,
    icon: "images",
  },
  [SectionType.RaspberryPi]: {
    title: "Raspberry Pi projects",
    description:
      "My other computer-related hobby is building things with Raspberry Pi boards.",
    component: RaspberryPi,
    icon: { svgPath: raspberryPiIconPath },
  },
}
