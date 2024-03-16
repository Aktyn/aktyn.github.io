import { createContext } from 'react'
import sectionColors from 'common-styles/palette.module.scss'

const sectionColorClassNames = Object.keys(sectionColors).reduce((acc, sectionClass) => {
  if (sectionClass.startsWith('class-')) {
    acc.push(sectionClass.replace(/^class-/i, ''))
  }
  return acc
}, [] as string[])

export enum Section {
  BASIC_INFO = 'BASIC_INFO',
  WEBSITES = 'WEBSITES',
  GAME_DEVELOPMENT = 'GAME_DEVELOPMENT',
  MICROCONTROLLERS = 'MICROCONTROLLERS',
  COMPUTER_GRAPHICS = 'COMPUTER_GRAPHICS',
}

export const sectionClassNames: { [key in Section]: string } = {
  [Section.BASIC_INFO]: sectionColorClassNames[0],
  [Section.WEBSITES]: sectionColorClassNames[1],
  [Section.GAME_DEVELOPMENT]: sectionColorClassNames[2],
  [Section.MICROCONTROLLERS]: sectionColorClassNames[3],
  [Section.COMPUTER_GRAPHICS]: sectionColorClassNames[4],
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
