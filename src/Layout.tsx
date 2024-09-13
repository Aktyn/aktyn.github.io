import { Navigator } from './components/Navigator'
import { About } from './components/views/About'
import { ComputerGraphics } from './components/views/ComputerGraphics'
import { GameDevelopment } from './components/views/GameDevelopment'
import { Microcontrollers } from './components/views/Microcontrollers'
import { Websites } from './components/views/Websites'

export function Layout() {
  return (
    <div>
      <About />
      <Websites />
      <GameDevelopment />
      <Microcontrollers />
      <ComputerGraphics />
      <Navigator />
    </div>
  )
}
