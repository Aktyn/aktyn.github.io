import { Button } from "~/components/ui/button"
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
        </main>
      </ScrollArea>
    </Background>
  )
}

export default App
