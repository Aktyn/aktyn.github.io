import { ViewType } from '../../context/viewContext'
import { viewNames } from '../../utils/consts'
import { defaultTypeInEffectDuration, TypeInEffect } from '../common/TypeInEffect'
import './About.scss'
import '../../style/typography.scss'

export function About() {
  return (
    <div className="view-container">
      <div className="about-main">
        <hr className="line-top" />
        <div className="details">
          <TypeInEffect className="text-large" delay={defaultTypeInEffectDuration * 0.5}>
            Radosław Krajewski
          </TypeInEffect>
          <TypeInEffect className="text-medium" delay={defaultTypeInEffectDuration * 1}>
            FRONT-END DEVELOPER
          </TypeInEffect>
          <div className="about-grid-2x2">
            {Object.values(ViewType).map(
              (view) =>
                view !== ViewType.ABOUT && (
                  <TypeInEffect
                    key={view}
                    className="text-small link"
                    delay={defaultTypeInEffectDuration * 1.5}
                    onClick={() => {
                      // if (section === activeSection) {
                      //   return
                      // }
                      // setSection(section as Section)
                    }}
                  >
                    {viewNames[view as unknown as ViewType]}
                  </TypeInEffect>
                ),
            )}
          </div>
          <div className="contact-info">
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
        <hr className="line-bottom" />
      </div>
    </div>
  )
}
