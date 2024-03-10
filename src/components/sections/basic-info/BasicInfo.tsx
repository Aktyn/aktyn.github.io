import { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import { TypeInEffect, defaultTypeInEffectDuration } from 'components/common/TypeInEffect'
import { Section, SectionContext, sectionNames } from 'context/SectionContext'
import logoFlat from 'img/logo_flat.png'
import { LogoBackground } from './LogoBackground'

import 'common-styles/typography.scss'
import './BasicInfo.scss'

export const BasicInfo = () => {
  const { section: activeSection, setSection } = useContext(SectionContext)

  const [isLogoLoaded, setIsLogoLoaded] = useState(false)
  const [logoEntered, setLogoEntered] = useState(false)

  useEffect(() => {
    if (!isLogoLoaded) {
      return
    }
    const timeout = setTimeout(() => {
      setLogoEntered(true)
    }, 2_000) // 2 seconds of logoEntryAnimation

    return () => {
      clearTimeout(timeout)
    }
  }, [isLogoLoaded])

  return (
    <div className="basic-info-main">
      <div className={clsx('logo-top', isLogoLoaded && 'loaded')}>
        {logoEntered && <LogoBackground />}
        <img
          src={logoFlat}
          onLoad={() => setIsLogoLoaded(true)}
          style={{ height: '16rem', width: 'auto', marginRight: '-26px' }}
        />
      </div>
      <div className="basic-info-details">
        <div className="basic-info-background">
          <span className="line-top" />
          <span className="line-bottom" />
        </div>
        <TypeInEffect className="text-large" delay={defaultTypeInEffectDuration * 0.5}>
          Radosław Krajewski
        </TypeInEffect>
        <TypeInEffect className="text-medium" delay={defaultTypeInEffectDuration * 1}>
          FRONT-END DEVELOPER
        </TypeInEffect>
        <div className="basic-info-grid-2x2">
          {Object.values(Section).map(
            (section) =>
              section !== Section.BASIC_INFO && (
                <TypeInEffect
                  key={section}
                  className="text-small link"
                  delay={defaultTypeInEffectDuration * 1.5}
                  onClick={() => {
                    if (section === activeSection) {
                      return
                    }
                    setSection(section)
                  }}
                >
                  {sectionNames[section]}
                </TypeInEffect>
              ),
          )}
        </div>
        <TypeInEffect className="text-medium" delay={defaultTypeInEffectDuration * 2}>
          Poland, Łódź
        </TypeInEffect>
        <TypeInEffect className="text-medium" delay={defaultTypeInEffectDuration * 2.5}>
          Aktyn3@gmail.com
        </TypeInEffect>
        <a href="https://github.com/Aktyn" target="_blank" rel="noreferrer">
          <TypeInEffect className="text-medium" delay={defaultTypeInEffectDuration * 3}>
            GitHub
          </TypeInEffect>
        </a>
      </div>
    </div>
  )
}
