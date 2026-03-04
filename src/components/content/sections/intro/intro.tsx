import type { ComponentProps } from 'react'
import { QuickPersonalInfo } from '~/components/content/sections/intro/quick-personal-info'
import { SocialLinks } from '~/components/content/sections/intro/social-links'
import { cn } from '~/lib/utils'
import { ProjectedText } from '../../projected-text'

import '../../../../styles/shining-text.css'

const fullName = 'Radosław Krajewski'
const role = 'Web Developer'
const experienceStartDate = new Date('2019-10-10')

type IntroProps = ComponentProps<'div'> & {
  ref: React.RefObject<HTMLDivElement | null>
}

export function Intro({ ref, className, ...props }: IntroProps) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col items-center justify-center text-center', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-4">
        <div>
          <h2>
            <ProjectedText text={fullName} fontSize={56} fontWeight="bold" />
          </h2>
          <h3 className="shining-text">
            <ProjectedText text={role} fontSize={32} fontWeight="medium" />
          </h3>
        </div>
        <QuickPersonalInfo
          experienceStartDate={experienceStartDate}
          // className="*:view-transition-base *:delay-200 *:zoom-in-100 *:nth-[-n+2]:slide-in-from-left-16 *:nth-last-[-n+2]:slide-in-from-right-16"
        />
        <SocialLinks
        // className="*:view-transition-base *:delay-300 *:zoom-in-100 *:first:slide-in-from-left *:last:slide-in-from-right"
        />
      </div>
      {/* <Separator className="view-transition-separator mask-linear-[to_right,transparent,black,transparent] delay-1000" /> */}
      {/* <QuickAccess className="*:*:view-transition-base self-start *:*:delay-400 *:*:slide-in-from-bottom *:*:nth-2:delay-500 *:*:nth-3:delay-600" /> */}
      {/* TODO: put "Scroll for more" here */}
    </div>
  )
}
