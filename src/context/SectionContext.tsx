import { createContext } from 'react'

export enum Section {
  BASIC_INFO = 'basic-info',
  WEBSITES = 'websites',
  GAME_DEVELOPMENT = 'game-development',
  MICROCONTROLLERS = 'microcontrollers',
  COMPUTER_GRAPHICS = 'computer-graphics',
}

export const sectionNames: { [key in Section]: string } = {
  [Section.BASIC_INFO]: 'Basic Info',
  [Section.WEBSITES]: 'Websites',
  [Section.GAME_DEVELOPMENT]: 'Game Development',
  [Section.MICROCONTROLLERS]: 'Microcontrollers',
  [Section.COMPUTER_GRAPHICS]: 'Computer Graphics',
}

export const SectionContext = createContext({
  section: Section.BASIC_INFO,
  setSection: (_targetSection: Section) => {},
  getPreviousSection: (_sourceSection?: Section): Section | null => Section.BASIC_INFO,
  previousSection: () => {},
  getNextSection: (_sourceSection?: Section): Section | null => Section.BASIC_INFO,
  nextSection: () => {},
  isFirstSection: true,
  isLastSection: false,
})
