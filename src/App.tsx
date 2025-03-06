import { Button } from "~/components/ui/button"
import { LOGO_PATH } from "./lib/consts"
import { Background } from "./components/background/background"
import { ScrollArea } from "./components/ui/scroll-area"

function App() {
  return (
    <Background className="flex flex-col items-center justify-center">
      <ScrollArea className="w-full h-full">
        <header className="w-full flex flex-row items-center justify-center p-8">
          <Button variant="default">Click me</Button>
        </header>
        <main className="flex flex-col items-center justify-center w-full px-8">
          Test Aktyn
          <svg viewBox="0 0 24 24" className="size-64">
            <path
              d={LOGO_PATH}
              className="fill-none stroke-foreground fixed-stroke"
            />
          </svg>
        </main>
      </ScrollArea>
    </Background>
  )
}

export default App
