import { Fragment, type ComponentProps } from 'react'
import { Separator } from '~/components/common/separator'
import { QuickPersonalInfo } from '~/components/content/sections/intro/quick-personal-info'
import { SocialLinks } from '~/components/content/sections/intro/social-links'
import { QuickAccess } from '~/components/content/sections/intro/quick-access'
import { useTranslation } from 'react-i18next'
import { Section } from '~/lib/consts'
import { cn } from '~/lib/utils'
import { ProjectedText } from '../../projected-elements/projected-text'
import { SectionContainer } from '../section-container'

import '../../../../styles/shining-text.css'

const fullName = 'Radosław Krajewski'
const experienceStartDate = new Date('2019-10-10')
const birthDate = new Date('1996-02-14')

type IntroProps = ComponentProps<'section'> & {
  ref: React.RefObject<HTMLDivElement | null>
}
export function Intro({ ref, className, ...props }: IntroProps) {
  const { t } = useTranslation()
  const role = t('intro.role')

  return (
    <SectionContainer
      ref={ref}
      section={Section.Intro}
      {...props}
      className={cn('gap-y-8 px-4 text-center', className)}
    >
      <div className="flex flex-1 flex-col items-center justify-end gap-6">
        <div data-header-anchor className="-mb-2">
          <h2>
            {fullName.split(' ').map((namePart, index, arr) => (
              <Fragment key={`${namePart}-${index}`}>
                <div
                  className="inline-block"
                  data-entry-animation-type={index % 2 === 0 ? 'from-left' : 'from-right'}
                >
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
        <QuickPersonalInfo experienceStartDate={experienceStartDate} birthDate={birthDate} />
        <SocialLinks />
      </div>
      {/* TODO: "Open for work" status inside separator */}
      <Separator
        data-entry-animation-type="zoom-in-x"
        className="not-print:mask-linear-[to_right,transparent,black_30%,black_70%,transparent]"
      />
      <QuickAccess className="flex-1 print:hidden" />
    </SectionContainer>
  )
}
