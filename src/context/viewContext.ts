import { createContext, type Dispatch, type SetStateAction } from 'react'

export enum ViewType {
  ABOUT = 'ABOUT',
  WEBSITES = 'WEBSITES',
  GAME_DEVELOPMENT = 'GAME_DEVELOPMENT',
  MICROCONTROLLERS = 'MICROCONTROLLERS',
  COMPUTER_GRAPHICS = 'COMPUTER_GRAPHICS',
}

export const ViewContext = createContext({
  view: ViewType.ABOUT,
  setView: (() => {}) as Dispatch<SetStateAction<ViewType>>,
})
