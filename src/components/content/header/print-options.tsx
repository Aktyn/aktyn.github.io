import { useState, type ComponentProps } from 'react'
import { Switch } from '~/components/common/switch'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'
import { useTranslation } from 'react-i18next'

type PrintOptionsProps = ComponentProps<'div'> & {
  showPrintOptions: boolean
  setShowPrintOptions: (showPrintOptions: boolean) => void
}

export function PrintOptions({
  showPrintOptions,
  setShowPrintOptions,
  ...props
}: PrintOptionsProps) {
  const [printWithImages, setPrintWithImages] = usePrintWithImages()
  const { t } = useTranslation()

  return (
    <div
      {...props}
      className={cn(
        'absolute inset-x-0 top-full flex flex-col items-center gap-2 rounded-lg border bg-background-lighter/50 p-2 transition-[opacity,translate]',
        showPrintOptions
          ? 'translate-y-2 opacity-100'
          : 'pointer-events-none -translate-y-8 opacity-0',
        props.className,
      )}
    >
      <Switch
        id="print-with-images-switch"
        label={t('header.printOptions.printWithImages')}
        enabled={printWithImages}
        onChange={setPrintWithImages}
      />
      <OptionButton onClick={() => window.print()}>
        <SvgIcon icon="Print" />
        <span>{t('header.printOptions.openPrintMenu')}</span>
      </OptionButton>
      <OptionButton onClick={() => setShowPrintOptions(false)}>
        <SvgIcon icon="Close" />
        <span>{t('header.printOptions.cancel')}</span>
      </OptionButton>
    </div>
  )
}

function OptionButton(props: ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className={cn(
        'flex w-full flex-row items-center justify-center gap-1 rounded-md border bg-background/50 p-1 text-sm font-semibold transition-colors hover:bg-background hover:text-foreground-complementary *:[svg]:size-4.5 *:[svg]:fill-current',
        props.className,
      )}
    />
  )
}

function usePrintWithImages() {
  const className = 'hide-images-in-print' //! Be careful when changing this class name, it's used in multiple tailwind classes

  const [printWithImages, internalSetPrintWithImages] = useState(
    !document.documentElement.classList.contains(className),
  )

  const setPrintWithImages = (printWithImages: boolean) => {
    if (printWithImages) {
      document.documentElement.classList.remove(className)
    } else {
      document.documentElement.classList.add(className)
    }
    internalSetPrintWithImages(printWithImages)
  }

  return [printWithImages, setPrintWithImages] as const
}
