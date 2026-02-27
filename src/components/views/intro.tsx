import { SocialLinks } from '~/components/social-links'
import { ShiningText } from '~/components/text-effects/shining-text'
import { QuickPersonalInfo } from '~/components/misc/quick-personal-info'
import { QuickAccess } from '~/components/misc/quick-access'
import { Separator } from '~/components/common/ui'

const fullName = 'Radosław Krajewski'
const role = 'Web Developer'
const experienceStartDate = new Date('2019-10-10')

export function Intro() {
  return (
    <div className="flex size-full min-h-full max-w-full flex-col items-center justify-center gap-y-8 p-6 *:not-data-[slot=separator]:flex-1">
      <div className="flex w-full flex-col items-center justify-end gap-y-6 text-center">
        <div className="relative view-transition-base *:text-5xl *:leading-none *:font-black *:tracking-wider *:not-last:pointer-events-none *:not-last:absolute *:not-last:inset-0 *:not-last:select-none">
          <div className="pointer-events-none -z-1 animate-in bg-linear-90 from-[oklch(63.92%_0.2104_5.28)] to-[oklch(84.33%_0.1606_165.37)] bg-clip-text text-transparent opacity-70 blur-2xl delay-600 duration-500 fill-mode-both select-none fade-in">
            {fullName}
          </div>
          <h2 className="text-white mix-blend-soft-light drop-shadow-[0_0_calc(var(--spacing)*0.5)_#000]">
            {fullName}
          </h2>
        </div>
        <div className="flex w-full flex-col items-center gap-y-2">
          <div className="view-transition-base delay-100">
            <ShiningText
              component="h3"
              className="text-3xl font-medium tracking-wide text-shadow-[0_0_calc(var(--spacing)*4)_#fff4]"
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
      <Separator className="view-transition-separator mask-linear-[to_right,transparent,black,transparent] delay-1000" />
      <QuickAccess className="self-start *:*:view-transition-base *:*:delay-400 *:*:slide-in-from-bottom *:*:nth-2:delay-500 *:*:nth-3:delay-600" />
    </div>
  )
}
