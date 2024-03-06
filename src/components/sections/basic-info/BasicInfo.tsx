import { useState } from 'react'
import clsx from 'clsx'
import { TypeInEffect, defaultTypeInEffectDuration } from 'components/common/TypeInEffect'
import logoFlat from 'img/logo_flat.png'

import 'common-styles/typography.scss'
import './BasicInfo.scss'

export const BasicInfo = () => {
  const [isLogoLoaded, setIsLogoLoaded] = useState(false)

  return (
    <div className="basic-info-main">
      <div className={clsx('logo-top', isLogoLoaded && 'loaded')}>
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
          <TypeInEffect className="text-small" delay={defaultTypeInEffectDuration * 1.5}>
            Websites
          </TypeInEffect>
          <TypeInEffect className="text-small" delay={defaultTypeInEffectDuration * 1.5}>
            Game development
          </TypeInEffect>
          <TypeInEffect className="text-small" delay={defaultTypeInEffectDuration * 1.5}>
            Computer graphics
          </TypeInEffect>
          <TypeInEffect className="text-small" delay={defaultTypeInEffectDuration * 1.5}>
            Neural networks
          </TypeInEffect>
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
