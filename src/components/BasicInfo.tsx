import { TypeInEffect, defaultTypeInEffectDuration } from './common/TypeInEffect'

import 'common-styles/typography.scss'
import './BasicInfo.scss'

export const BasicInfo = () => {
  return (
    <div className="basic-info-main">
      <div className="basic-info-background" />
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
          Games development
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
  )
}
