import { useTranslation } from 'react-i18next'
import { properNouns } from './cv-helpers'

export function CvHeader() {
  const { t } = useTranslation()

  return (
    <header className="flex flex-col">
      <h1 className="text-4xl font-bold tracking-widest text-black uppercase">
        {properNouns.fullName}
      </h1>
      <h2
        className="
          mt-1 text-2xl font-medium tracking-wider text-neutral-700 uppercase
        "
      >
        {t('intro.role')}
      </h2>
      {/* TODO: photo */}
    </header>
  )
}
