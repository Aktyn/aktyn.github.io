import { useTranslation } from 'react-i18next'
import { CvSectionTitle } from './cv-section-title'
import { CvTimeline } from './cv-timeline'

export function CvEducation() {
  const { t } = useTranslation()

  return (
    <div>
      <CvSectionTitle>{t('cv.education')}</CvSectionTitle>

      <CvTimeline
        items={[
          {
            title: t('cv.universityTitle'),
            date: {
              start: t('cv.universityDate.start'),
              end: t('cv.universityDate.end'),
            },
            desc: t('cv.universityDesc'),
          },
          {
            title: t('cv.graduationTitle'),
            date: {
              start: t('cv.graduationDate.start'),
              end: t('cv.graduationDate.end'),
            },
            desc: t('cv.graduationDesc'),
          },
          {
            title: t('cv.apprenticeRole'),
            date: t('cv.gePowerDate'),
            desc: t('cv.apprenticeDesc'),
          },
        ]}
      />
    </div>
  )
}
