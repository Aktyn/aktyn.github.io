import { Introduction } from "~/components/views/introduction.tsx"
import { SocialLinks } from "~/components/social-links.tsx"
import { ChevronDown } from "lucide-react"
import { ViewModule } from "~/modules/view.module.tsx"

export function Intro() {
  const { setView } = ViewModule.useView()

  return (
    <div className="size-full flex flex-col items-center justify-center relative">
      <Introduction />
      <SocialLinks />
      <div
        className="flex flex-col items-center absolute bottom-4 inset-x-auto cursor-pointer text-muted-foreground hover:text-primary transition-colors *:animate-bounce *:animation-duration-2000"
        onClick={() => setView(ViewModule.View.PublicProjects)}
      >
        <p className="text-xs font-medium">Scroll for more</p>
        <ChevronDown className="size-4 delay-[-100ms]!" />
        <ChevronDown className="size-4 -mt-2 delay-[-300ms]!" />
      </div>
    </div>
  )
}
