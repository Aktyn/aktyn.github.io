import { useTranslation } from 'react-i18next'
import { CvSectionTitle } from './cv-section-title'

export function CvEducation() {
  const { t } = useTranslation()

  return (
    <div>
      <CvSectionTitle>{t('cv.education')}</CvSectionTitle>
      <div
        className="
          relative ml-1.5 space-y-4 border-l-2 border-foreground-complementary
          pl-5
        "
      >
        {/* UŁ */}
        <div className="relative">
          <span
            className="
              absolute top-1 -left-6.75 h-2.5 w-2.5 rounded-full border-2
              border-white bg-foreground-complementary
            "
          />
          <div className="mb-0.5 flex items-baseline justify-between">
            <h4 className="text-xs font-bold text-neutral-900">{t('cv.universityTitle')}</h4>
            <span
              className="
                text-[10px] font-semibold whitespace-nowrap
                text-foreground-complementary
              "
            >
              {t('cv.universityDate')}
            </span>
          </div>
          <div
            className="
              mb-1 text-[10px] font-bold tracking-wider text-neutral-500
              uppercase
            "
          >
            {t('cv.universityDesc')}
          </div>
        </div>

        {/* ZSP */}
        <div className="relative">
          <span
            className="
              absolute top-1 -left-6.75 h-2.5 w-2.5 rounded-full border-2
              border-white bg-foreground-complementary
            "
          />
          <div className="mb-0.5 flex items-baseline justify-between">
            <h4 className="text-xs font-bold text-neutral-900">{t('cv.graduationTitle')}</h4>
            <span
              className="
                text-[10px] font-semibold whitespace-nowrap
                text-foreground-complementary
              "
            >
              {t('cv.graduationDate')}
            </span>
          </div>
          <div
            className="
              mb-1 text-[10px] font-bold tracking-wider text-neutral-500
              uppercase
            "
            // eslint-disable-next-line i18next/no-literal-string
          >
            Zespół Szkół Ponadgimnazjalnych im. J. Piłsudskiego
          </div>
        </div>

        {/* Apprenticeship */}
        <div className="relative">
          <span
            className="
              absolute top-1 -left-6.75 h-2.5 w-2.5 rounded-full border-2
              border-white bg-foreground-complementary
            "
          />
          <div className="mb-0.5 flex items-baseline justify-between">
            <h4 className="text-xs font-bold text-neutral-900">{t('cv.apprenticeRole')}</h4>
            <span
              className="
                text-[10px] font-semibold whitespace-nowrap
                text-foreground-complementary
              "
            >
              {t('cv.gePowerDate')}
            </span>
          </div>
          <div
            className="
              mb-1 text-[10px] font-bold tracking-wider text-neutral-500
              uppercase
            "
          >
            {t('cv.apprenticeDesc')}
          </div>
        </div>
      </div>
    </div>
  )
}
