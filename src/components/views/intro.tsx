import { SocialLinks } from "~/components/social-links"
import { ChevronDown } from "lucide-react"
import { ViewModule } from "~/modules/view.module"
import { ShiningText } from "~/components/text-effects/shining-text"
import { QuickPersonalInfo } from "~/components/misc/quick-personal-info"
import { QuickAccess } from "~/components/misc/quick-access"
import { Separator } from "~/components/ui/separator"

const fullName = "Radosław Krajewski"
const role = "Frontend Developer"
const experienceStartDate = new Date("2019-10-10")

export function Intro() {
  const { setView } = ViewModule.useView()

  return (
    <div className="size-full max-w-full grid grid-cols-1 grid-rows-[1fr_1px_1fr] justify-center gap-y-8 relative">
      <div className="self-end w-full px-6 pt-6 flex flex-col items-center justify-center gap-y-6 text-center">
        <div className="relative *:text-5xl *:font-black *:leading-none *:tracking-wider *:not-last:absolute *:not-last:inset-0 *:not-last:select-none *:not-last:pointer-events-none backdrop-hue-rotate-0">
          <div className="bg-linear-90 from-[oklch(63.92%_0.2104_5.28)] to-[oklch(84.33%_0.1606_165.37)] bg-clip-text text-transparent blur-2xl -z-1 opacity-70 animate-in fade-in delay-600 duration-500 fill-mode-both pointer-events-none select-none">
            {fullName}
          </div>
          <h2 className="text-white drop-shadow-[0_0_calc(var(--spacing)*0.5)_#000] mix-blend-soft-light">
            {fullName}
          </h2>
        </div>
        <div className="w-full flex flex-col items-center gap-y-2">
          <ShiningText
            component="h3"
            className="text-3xl tracking-wide font-medium text-shadow-[0_0_calc(var(--spacing)*4)_#fff4]"
          >
            {role}
          </ShiningText>
          <QuickPersonalInfo experienceStartDate={experienceStartDate} />
          <SocialLinks />
        </div>
      </div>

      <Separator className="mask-linear-[to_right,transparent,black,transparent]" />

      <QuickAccess className="self-start" />

      <div
        className="flex flex-col items-center justify-self-center absolute bottom-4 inset-x-auto cursor-pointer text-muted-foreground hover:text-primary hover:scale-110 transition-[color,scale] ease-bounce *:animate-bounce *:animation-duration-2000"
        onClick={() => setView(ViewModule.View.PublicProjects)}
      >
        <p className="text-xs font-medium">Scroll for more</p>
        <ChevronDown className="size-4 delay-[-100ms]!" />
        <ChevronDown className="size-4 -mt-2 delay-[-300ms]!" />
      </div>
    </div>
  )
}
