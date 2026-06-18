import { useTranslation } from 'react-i18next'

/** This component is meant to render printable CV inside browser's print panel */
export function CV() {
  const { t } = useTranslation()

  //TODO: render CV
  return (
    <div
      className="
        m-0 p-8 text-left text-black text-shadow-none
        **:[svg]:fill-black
      "
    >
      {t('header.cv')}
    </div>
  )
}
