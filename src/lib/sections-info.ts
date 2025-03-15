import { type DynamicIcon } from "lucide-react/dynamic"
import { type ComponentProps } from "react"
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
    icon: "gamepad",
  },
  [SectionType.ComputerGraphics]: {
    title: "Computer graphics",
    description:
      "Computer graphics is also one of my passions that I can share here. I'm not a professional in this field, but I like to create some graphics from time to time.",
    icon: "images",
  },
  [SectionType.RaspberryPi]: {
    title: "Raspberry Pi projects",
    description:
      "My other computer-related hobby is building things with Raspberry Pi boards.",
    icon: { svgPath: raspberryPiIconPath },
  },
}
