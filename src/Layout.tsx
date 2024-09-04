import { Navigator } from './components/Navigator'
import { About } from './components/views/About'
import { Websites } from './components/views/Websites'

export function Layout() {
  return (
    <div>
      <About />
      <Websites />
      {/* TODO: another views */}
      <Navigator />
    </div>
  )
}
