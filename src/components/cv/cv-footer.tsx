import { useTranslation } from 'react-i18next'

export function CvFooter() {
  const { t } = useTranslation()

  return (
    <div className="mt-auto">
      <p
        className="
          border-t border-neutral-100 pt-3 text-justify text-[8px]
          leading-relaxed text-neutral-400
        "
      >
        {t('cv.gdpr')}
      </p>
    </div>
  )
}
