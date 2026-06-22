import { type PropsWithChildren } from 'react'
import { Separator } from '../common/separator'
import { usePrintOptions } from '../content/header/print-options'
import { CvAboutMe } from './cv-about-me'
import { CvContact } from './cv-contact'
import { CvEducation } from './cv-education'
import { CvExperience } from './cv-experience'
import { CvFooter } from './cv-footer'
import { CvHeader } from './cv-header'
import { CvTechnologies } from './cv-technologies'

/** This component is meant to render a printable CV inside the browser's print panel */
export function CV() {
  const noColors = document.documentElement.classList.contains(usePrintOptions.className)

  return (
    <div
      style={{
        //@ts-expect-error Defining css variable in style attribute is not supported
        ['--foreground-complementary']: noColors ? '0.8 0 0' : '0.7423 0.073 276.54',
      }}
      className="
        relative m-0 mx-auto my-0 box-border flex h-screen w-full flex-col
        justify-between gap-[6mm] overflow-hidden p-[12mm] font-sans text-black
        shadow-none
      "
    >
      <CvHeader noColors={noColors} />

      <div className="flex w-full grow flex-col gap-[4mm] overflow-hidden *:w-full">
        <div className="grid grid-cols-[5fr_1px_9fr] gap-[8mm]">
          <CvLayoutColumn>
            <CvContact />
            <CvAboutMe />
          </CvLayoutColumn>

          <Separator orientation="vertical" className="bg-neutral-100" />

          <CvLayoutColumn>
            <CvExperience />
            <CvEducation />
          </CvLayoutColumn>
        </div>

        <Separator orientation="horizontal" className="bg-neutral-100" />

        <CvTechnologies noColors={noColors} />
      </div>

      <CvFooter />
    </div>
  )
}

function CvLayoutColumn({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-6">{children}</div>
}
