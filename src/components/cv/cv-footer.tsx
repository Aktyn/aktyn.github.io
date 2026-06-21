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
        {/* TODO: verify this in both languages */}
        {t('cv.gdpr')}
      </p>
      {/* Slanted decoration footer matching layout */}
      <div
        className="
          relative mx-[-15mm] mt-4 mb-[-15mm] h-6 w-[210mm] overflow-hidden
          select-none
          print:hidden
        "
      >
        <div
          className="
            absolute inset-0 origin-bottom-right skew-y-2 transform
            bg-neutral-900
          "
        />
        <div
          className="
            absolute inset-0 origin-bottom-right skew-y-1 transform
            bg-neutral-800 opacity-80
          "
        />
      </div>
    </div>
  )
}
