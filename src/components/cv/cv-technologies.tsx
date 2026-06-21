import { useTranslation } from 'react-i18next'
import { techStack, TechStackCategory, useTechStackInfo } from '~/lib/tech-stack'
import { cn } from '~/lib/utils'
import { CvSectionTitle } from './cv-section-title'

const techStackCategories = Object.values(TechStackCategory)
const sectionTitlesMap = {
  [TechStackCategory.Frontend]: 'cv.frontend-technologies',
  [TechStackCategory.Backend]: 'cv.backend-technologies',
  [TechStackCategory.KnownTools]: 'cv.known-tools',
} as const satisfies { [key in TechStackCategory]: string }

const omit: Array<keyof typeof techStack> = [
  'html',
  'css',
  'javascript',
  'webpack',
  'electron',
  'css',
  'java',
  'jest',
  'nodejs',
  'git',
]

export function CvTechnologies({ noColors }: { noColors: boolean }) {
  const { t } = useTranslation()

  const techStackInfo = useTechStackInfo()

  const wideGroups = [
    t('techStack.backend.groups.microcontrollers'),
    t('techStack.knownTools.groups.management'),
  ] as const

  return (
    <>
      <div className="flex flex-row gap-[8mm] overflow-hidden">
        {techStackCategories.map((category) => (
          <div>
            <CvSectionTitle>{t(sectionTitlesMap[category])}</CvSectionTitle>
            <div className="flex flex-col flex-wrap gap-[4mm] overflow-hidden">
              <div
                key={category}
                className="
                  flex flex-row flex-wrap justify-start gap-[2mm]
                  *:min-w-1/3 *:flex-1
                "
              >
                {techStackInfo[category].stackGroups.map((stackGroup) => (
                  <div
                    key={stackGroup.title}
                    className={cn(
                      'flex flex-col',
                      wideGroups.includes(stackGroup.title) && 'min-w-full!',
                    )}
                  >
                    <div className="line-clamp-2 text-[10px] text-neutral-500">
                      {stackGroup.title}
                    </div>
                    <div
                      className="
                        flex flex-col flex-wrap gap-x-[4mm] gap-y-[1mm]
                      "
                    >
                      {stackGroup.stack.map((tech) =>
                        omit.includes(tech) ? null : (
                          <div
                            className="
                              flex flex-row items-center gap-1 text-black
                            "
                          >
                            {techStack[tech].icon ? (
                              <i
                                className={cn(
                                  noColors
                                    ? techStack[tech].icon.replace('colored', '')
                                    : techStack[tech].icon,
                                  noColors && 'text-neutral-800',
                                )}
                              />
                            ) : (
                              <span
                                className="
                                  flex size-4.5 items-center justify-center
                                "
                              >
                                <span
                                  className="
                                    size-1.5 rounded-full
                                    bg-foreground-complementary!
                                  "
                                />
                              </span>
                            )}
                            <span className="text-xs whitespace-nowrap">
                              {techStack[tech].name}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-[9px] whitespace-pre-wrap text-neutral-400">
        {t('cv.technologies-disclaimer')}
      </div>
    </>
  )
}
