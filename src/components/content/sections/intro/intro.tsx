import { Fragment, type ComponentProps } from 'react'
import { Separator } from '~/components/common/separator'
import { QuickPersonalInfo } from '~/components/content/sections/intro/quick-personal-info'
import { SocialLinks } from '~/components/content/sections/intro/social-links'
import { QuickAccess } from '~/components/misc/quick-access'
import { Section } from '~/lib/consts'
import { cn } from '~/lib/utils'
import { ProjectedText } from '../../projected-elements/projected-text'

import '../../../../styles/shining-text.css'

const fullName = 'Radosław Krajewski'
const role = 'Web Developer'
const experienceStartDate = new Date('2019-10-10')

type IntroProps = ComponentProps<'section'> & {
  ref: React.RefObject<HTMLDivElement | null>
}

export function Intro({ ref, className, ...props }: IntroProps) {
  return (
    <section
      ref={ref}
      id={Section.Intro}
      className={cn('flex flex-col items-center justify-center gap-y-8 text-center', className)}
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
      <Separator
        data-entry-animation-type="zoom-in-x"
        className="mask-linear-[to_right,transparent,black_30%,black_70%,transparent]"
      />
      <QuickAccess />
    </section>
  )
}
