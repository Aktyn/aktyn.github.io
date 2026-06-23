import { useTranslation } from 'react-i18next'
import { CvSectionTitle } from './cv-section-title'

export function CvAboutMe() {
  const { t } = useTranslation()

  return (
    <div>
      <CvSectionTitle>{t('cv.aboutMe')}</CvSectionTitle>
      <p
        className="
          text-[10px] leading-normal text-pretty whitespace-pre-wrap
          text-neutral-700
        "
      >
        {t('cv.aboutMeContent')}
      </p>
    </div>
  )
}
