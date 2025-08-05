import { SocialLinks } from "~/components/social-links"
import { ShiningText } from "~/components/text-effects/shining-text"
import { QuickPersonalInfo } from "~/components/misc/quick-personal-info"
import { QuickAccess } from "~/components/misc/quick-access"
import { Separator } from "~/components/ui/separator"

const fullName = "Radosław Krajewski"
const role = "Frontend Developer"
const experienceStartDate = new Date("2019-10-10")

export function Intro() {
  return (
    <div className="size-full min-h-full max-w-full flex flex-col *:not-data-[slot=separator]:flex-1 items-center justify-center gap-y-8 p-6">
      <div className="w-full flex flex-col items-center justify-end gap-y-6 text-center">
        <div className="relative *:text-5xl *:font-black *:leading-none *:tracking-wider *:not-last:absolute *:not-last:inset-0 *:not-last:select-none *:not-last:pointer-events-none view-transition-base">
          <div className="bg-linear-90 from-[oklch(63.92%_0.2104_5.28)] to-[oklch(84.33%_0.1606_165.37)] bg-clip-text text-transparent blur-2xl -z-1 opacity-70 animate-in fade-in delay-600 duration-500 fill-mode-both pointer-events-none select-none">
            {fullName}
          </div>
          <h2 className="text-white drop-shadow-[0_0_calc(var(--spacing)*0.5)_#000] mix-blend-soft-light">
            {fullName}
          </h2>
        </div>
        <div className="w-full flex flex-col items-center gap-y-2">
          <div className="view-transition-base delay-100">
            <ShiningText
              component="h3"
              className="text-3xl tracking-wide font-medium text-shadow-[0_0_calc(var(--spacing)*4)_#fff4]"
            >
              {role}
            </ShiningText>
          </div>
          <QuickPersonalInfo
            experienceStartDate={experienceStartDate}
            className="*:view-transition-base *:delay-200 *:zoom-in-100 *:nth-[-n+2]:slide-in-from-left-16 *:nth-last-[-n+2]:slide-in-from-right-16"
          />
          <SocialLinks className="*:view-transition-base *:delay-300 *:zoom-in-100 *:first:slide-in-from-left *:last:slide-in-from-right" />
        </div>
      </div>
      <Separator className="mask-linear-[to_right,transparent,black,transparent] view-transition-separator delay-1000" />
      <QuickAccess className="self-start *:*:view-transition-base *:*:delay-400 *:*:nth-2:delay-500 *:*:nth-3:delay-600 *:*:slide-in-from-bottom" />
    </div>
  )
}
