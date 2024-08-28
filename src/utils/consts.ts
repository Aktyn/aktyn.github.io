import { ViewType } from '../context/viewContext'

export const viewNames: { [key in ViewType]: string } = {
  [ViewType.ABOUT]: 'About',
  [ViewType.WEBSITES]: 'Websites',
  [ViewType.GAME_DEVELOPMENT]: 'Game development',
  [ViewType.MICROCONTROLLERS]: 'Microcontrollers',
  [ViewType.COMPUTER_GRAPHICS]: 'Computer graphics',
}

export const wheelStrengthMultiplier = 2
export const scrollAnimationSpeed = 3
