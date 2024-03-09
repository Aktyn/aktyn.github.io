import { createContext } from 'react'

export enum Section {
  BASIC_INFO = 'basic-info',
  WEBSITES = 'websites',
  GAME_DEVELOPMENT = 'game-development',
  MICROCONTROLLERS = 'microcontrollers',
  COMPUTER_GRAPHICS = 'computer-graphics',
}

export const SectionContext = createContext({
  section: Section.BASIC_INFO,
  setSection: (_: Section) => {},
  previousSection: () => {},
  nextSection: () => {},
  isFirstSection: true,
  isLastSection: false,
})
