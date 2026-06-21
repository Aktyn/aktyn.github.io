import { useTranslation } from 'react-i18next'
import { CvSectionTitle } from './cv-section-title'

export function CvExperience() {
  const { t } = useTranslation()

  return (
    <div>
      <CvSectionTitle>{t('cv.experience')}</CvSectionTitle>
      <div
        className="
          relative ml-1.5 space-y-4 border-l-2 border-foreground-complementary
          pl-5
        "
      >
        {/* Night Woods */}
        <div className="relative">
          <span
            className="
              absolute top-1 -left-6.75 h-2.5 w-2.5 rounded-full border-2
              border-white bg-foreground-complementary
            "
          />
          <div className="mb-0.5 flex items-baseline justify-between">
            <h4 className="text-xs font-bold text-neutral-900">Night Woods</h4>
            <span
              className="
                text-[10px] font-semibold whitespace-nowrap
                text-foreground-complementary
              "
            >
              {t('timeline.work.nightWoods.start')} – {t('timeline.work.nightWoods.end')}
            </span>
          </div>
          <div
            className="
              mb-1.5 text-[10px] font-bold tracking-wider text-neutral-500
              uppercase
            "
          >
            {t('cv.nightWoodsRole')}
          </div>
          <ul
            className="
              list-disc space-y-1 pl-3 text-[10px] leading-relaxed
              text-neutral-600
            "
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index}>
                {t(`cv.nightWoodsBullets.${(index + 1).toString() as '1' | '2' | '3'}`)}
              </li>
            ))}
          </ul>
        </div>

        {/* Enigma */}
        <div className="relative">
          <span
            className="
              absolute top-1 -left-6.75 h-2.5 w-2.5 rounded-full border-2
              border-white bg-foreground-complementary
            "
          />
          <div className="mb-0.5 flex items-baseline justify-between">
            <h4 className="text-xs font-bold text-neutral-900">
              Enigma Systemy Ochrony Informacji
            </h4>
            <span
              className="
                text-[10px] font-semibold whitespace-nowrap
                text-foreground-complementary
              "
            >
              {t('timeline.work.enigma.start')} – {t('timeline.work.enigma.end')}
            </span>
          </div>
          <div
            className="
              mb-1.5 text-[10px] font-bold tracking-wider text-neutral-500
              uppercase
            "
          >
            {t('cv.enigmaRole')}
          </div>
          <ul
            className="
              list-disc space-y-1 pl-3 text-[10px] leading-relaxed
              text-neutral-600
            "
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index}>
                {t(`cv.enigmaBullets.${(index + 1).toString() as '1' | '2' | '3'}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
