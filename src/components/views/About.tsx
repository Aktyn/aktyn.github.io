import { useContext, useEffect } from 'react'
import { ViewContext, ViewType } from '../../context/viewContext'
import { LogoEdges } from '../../scene-3D/objects/logo-edges'
import { viewNames } from '../../utils/consts'
import { clamp } from '../../utils/math'
import { defaultTypeInEffectDuration, TypeInEffect } from '../common/TypeInEffect'

import '../../style/typography.scss'
import './About.scss'

export function About() {
  const { view: currentView, scrollValue, setView, scene } = useContext(ViewContext)

  useEffect(() => {
    if (!scene || currentView !== ViewType.ABOUT) {
      return
    }

    const logo = new LogoEdges(scene.getScene())
    scene.addObject(logo)

    return () => {
      scene.removeObject(logo)
      logo.destroy()
    }
  }, [currentView, scene])

  const hideFactor = Math.min(1, scrollValue)

  return (
    <div className="view-container">
      <div
        className="about-main"
        style={{
          transform: `translateY(${-hideFactor * 50}vh)`,
          opacity: clamp((1 - hideFactor) * 2, 0, 1),
          pointerEvents: hideFactor > 0 ? 'none' : 'auto',
          userSelect: hideFactor > 0.5 ? 'none' : 'auto',
        }}
      >
        <hr className="line-top" style={{ marginRight: `${hideFactor * 50}%` }} />
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
                      if (view === currentView) {
                        return
                      }
                      setView(view)
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
          <TypeInEffect
            className="text-medium"
            delay={defaultTypeInEffectDuration * 3.5}
            style={{ color: '#FF8A65' }}
          >
            Work is currently suspended on this project!
          </TypeInEffect>
        </div>
        <hr className="line-bottom" style={{ marginLeft: `${hideFactor * 50}%` }} />
      </div>
    </div>
  )
}
