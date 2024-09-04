import { createContext, type Dispatch } from 'react'
import type { Scene3D } from '../scene-3D'

export enum ViewType {
  ABOUT = 'ABOUT',
  WEBSITES = 'WEBSITES',
  GAME_DEVELOPMENT = 'GAME_DEVELOPMENT',
  MICROCONTROLLERS = 'MICROCONTROLLERS',
  COMPUTER_GRAPHICS = 'COMPUTER_GRAPHICS',
}

export const ViewContext = createContext({
  view: ViewType.ABOUT,
  setView: (() => {}) as Dispatch<ViewType>,
  scrollValue: 0,
  goTo: (_scrollValue: number) => {},
  scene: null as Scene3D | null,
  setScene: (() => {}) as Dispatch<Scene3D>,
})
