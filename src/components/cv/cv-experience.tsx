import { useTranslation } from 'react-i18next'
import { CvSectionTitle } from './cv-section-title'
import { CvTimeline } from './cv-timeline'

export function CvExperience() {
  const { t } = useTranslation()

  return (
    <div>
      <CvSectionTitle>{t('cv.experience')}</CvSectionTitle>
      <CvTimeline
        items={[
          {
            title: t('names.nightWoods'),
            date: {
              start: t('timeline.work.nightWoods.start'),
              end: t('timeline.work.nightWoods.end'),
            },
            desc: t('cv.nightWoodsRole'),
            responsibilities: Array.from({ length: 4 }).map((_, index) =>
              t(`cv.nightWoodsBullets.${(index + 1).toString() as '1' | '2' | '3' | '4'}`),
            ),
          },
          {
            title: t('names.enigma'),
            date: {
              start: t('timeline.work.enigma.start'),
              end: t('timeline.work.enigma.end'),
            },
            desc: t('cv.enigmaRole'),
            responsibilities: Array.from({ length: 2 }).map((_, index) =>
              t(`cv.enigmaBullets.${(index + 1).toString() as '1' | '2'}`),
            ),
          },
        ]}
      />
      <div
        className="
          mt-[2mm] ml-[6mm] text-[9px] whitespace-pre-wrap text-neutral-400
        "
      >
        {t('cv.experience-personal-projects-disclaimer')}
      </div>
    </div>
  )
}
