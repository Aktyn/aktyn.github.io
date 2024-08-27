import { Navigator } from './components/Navigator'
import { About } from './components/views/About'

export function Layout() {
  return (
    <div>
      <About />
      {/* TODO: another views */}
      <Navigator />
    </div>
  )
}
