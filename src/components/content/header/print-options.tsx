import { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from '~/components/common/switch'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'

type PrintOptionsProps = ComponentProps<'div'> & {
  showPrintOptions: boolean
  setShowPrintOptions: (showPrintOptions: boolean) => void
}

export function PrintOptions({
  showPrintOptions,
  setShowPrintOptions,
  ...props
}: PrintOptionsProps) {
  const { printWithColors, setPrintWithColors } = usePrintOptions()
  const { t } = useTranslation()

  return (
    <div
      {...props}
      className={cn(
        `
          absolute top-full right-0 flex flex-col items-center gap-3 rounded-lg
          border bg-background-lighter/50 p-2 backdrop-blur-sm
          transition-[opacity,translate]
        `,
        showPrintOptions
          ? 'translate-y-2 opacity-100'
          : 'pointer-events-none -translate-y-8 opacity-0',
        props.className,
      )}
    >
      <Switch
        id="print-with-colors-switch"
        label={t('header.printOptions.printWithColors')}
        enabled={printWithColors}
        onChange={setPrintWithColors}
      />
      <OptionButton onClick={() => window.print()}>
        <SvgIcon icon="Print" />
        <span className="whitespace-nowrap">{t('header.printOptions.openPrintMenu')}</span>
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
        `
          flex w-full flex-row items-center justify-center gap-1 rounded-md
          border bg-background/50 p-1 px-2 text-sm font-semibold
          transition-colors
          hover:bg-background hover:text-foreground-complementary
          *:[svg]:size-4.5 *:[svg]:fill-current
        `,
        props.className,
      )}
    />
  )
}

const className = 'print-without-colors' //! Be careful when changing this class name, it's used in other files
export function usePrintOptions() {
  const [printWithColors, internalSetPrintWithColors] = useState(
    !document.documentElement.classList.contains(className),
  )

  const setPrintWithColors = (printWithColors: boolean) => {
    if (printWithColors) {
      document.documentElement.classList.remove(className)
    } else {
      document.documentElement.classList.add(className)
    }
    internalSetPrintWithColors(printWithColors)
  }

  return { printWithColors, setPrintWithColors }
}
usePrintOptions.className = className
