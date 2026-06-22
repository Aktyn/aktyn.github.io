import { useTranslation } from 'react-i18next'
import { CvSectionTitle } from './cv-section-title'

export function CvAboutMe() {
  const { t } = useTranslation()

  return (
    <div>
      <CvSectionTitle>{t('cv.aboutMe')}</CvSectionTitle>
      <p
        className="
          text-[11px] leading-relaxed font-semibold text-pretty
          whitespace-pre-wrap text-neutral-700
        "
      >
        {/* TODO: write the content in translation files */}
        {t('cv.aboutMeContent')}
      </p>
    </div>
  )
}
