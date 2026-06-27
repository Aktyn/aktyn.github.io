import { useTranslation } from 'react-i18next'
import { contactValues } from './cv-helpers'
import { cn } from '~/lib/utils'

export function CvHeader({ noColors }: { noColors: boolean }) {
  const { t } = useTranslation()

  return (
    <header className="flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold tracking-widest text-black uppercase">
          {contactValues.fullName}
        </h1>
        <h2
          className="
            mt-1 text-2xl font-medium tracking-wider text-neutral-700 uppercase
          "
        >
          {t('intro.role')}
        </h2>
      </div>
      <img
        src="/img/cv-photo.jpg"
        alt="Photo of Radosław Krajewski"
        width={120}
        height={120}
        className={cn('my-[-4mm] h-[30mm] w-auto', noColors && 'grayscale-100')}
      />
    </header>
  )
}
