import { Fragment, type ComponentProps } from 'react'
import { QuickPersonalInfo } from '~/components/content/sections/intro/quick-personal-info'
import { SocialLinks } from '~/components/content/sections/intro/social-links'
import { cn } from '~/lib/utils'
import { ProjectedText } from '../../projected-elements/projected-text'

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
      <div className="flex flex-col items-center gap-6">
        <div className="-mb-2">
          <h2>
            {fullName.split(' ').map((namePart, index, arr) => (
              <Fragment key={`${namePart}-${index}`}>
                <div className="inline-block" data-entry-animation-type="from-top">
                  <ProjectedText text={namePart} fontSize={56} fontWeight="bold" />
                </div>
                {index < arr.length - 1 && <span style={{ fontSize: 56 }}>&nbsp;</span>}
              </Fragment>
            ))}
          </h2>
          <h3 data-entry-animation className="shining-text">
            <ProjectedText text={role} fontSize={32} fontWeight="medium" />
          </h3>
        </div>
        <QuickPersonalInfo experienceStartDate={experienceStartDate} />
        <SocialLinks />
      </div>
      {/* <Separator className="view-transition-separator mask-linear-[to_right,transparent,black,transparent] delay-1000" /> */}
      {/* <QuickAccess className="*:*:view-transition-base self-start *:*:delay-400 *:*:slide-in-from-bottom *:*:nth-2:delay-500 *:*:nth-3:delay-600" /> */}
      {/* TODO: put "Scroll for more" here */}
    </div>
  )
}
