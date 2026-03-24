import { useEffect, useState, type ComponentProps } from 'react'
import { Switch } from '~/components/common/switch'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'
import { useTranslation } from 'react-i18next'
import { Section, sectionData } from '~/lib/consts'

type PrintOptionsProps = ComponentProps<'div'> & {
  showPrintOptions: boolean
  setShowPrintOptions: (showPrintOptions: boolean) => void
}

export function PrintOptions({
  showPrintOptions,
  setShowPrintOptions,
  ...props
}: PrintOptionsProps) {
  const { printWithImages, setPrintWithImages, printSections, setPrintSections } = usePrintOptions()
  const { t } = useTranslation()

  return (
    <div
      {...props}
      className={cn(
        'absolute top-full right-0 flex flex-col items-center gap-3 rounded-lg border bg-background-lighter/50 p-2 transition-[opacity,translate]',
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
      <div className="flex flex-col items-stretch gap-1">
        <div className="text-center text-sm font-semibold">
          {t('header.printOptions.sectionsToPrint')}
        </div>
        {Object.values(Section).map((section) => (
          <SectionVisibilitySwitch
            key={section}
            section={section}
            enabled={printSections.includes(section)}
            onChange={(enabled) =>
              setPrintSections(
                enabled ? [...printSections, section] : printSections.filter((s) => s !== section),
              )
            }
          />
        ))}
      </div>
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

type SectionVisibilitySwitchProps = Pick<ComponentProps<typeof Switch>, 'enabled' | 'onChange'> & {
  section: Section
}

function SectionVisibilitySwitch({ section, ...props }: SectionVisibilitySwitchProps) {
  const { t } = useTranslation()

  return (
    <Switch
      id={`print-section-visibility-switch-${section}`}
      label={t(`sections.${section}.title`, sectionData[section].title)}
      {...props}
    />
  )
}

function OptionButton(props: ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className={cn(
        'flex w-full flex-row items-center justify-center gap-1 rounded-md border bg-background/50 p-1 px-2 text-sm font-semibold transition-colors hover:bg-background hover:text-foreground-complementary *:[svg]:size-4.5 *:[svg]:fill-current',
        props.className,
      )}
    />
  )
}

function usePrintOptions() {
  const className = 'hide-images-in-print' //! Be careful when changing this class name, it's used in multiple tailwind classes

  const [printWithImages, internalSetPrintWithImages] = useState(
    !document.documentElement.classList.contains(className),
  )
  const [printSections, setPrintSections] = useState<Array<Section>>(
    Object.values(Section).filter((section) => section !== Section.PublicProjects),
  )

  useEffect(() => {
    for (const section of Object.values(Section)) {
      const className = `hide-section-${section}-in-print` //! Be careful when changing this class name, it's used in multiple tailwind classes

      if (printSections.includes(section)) {
        document.documentElement.classList.remove(className)
      } else {
        document.documentElement.classList.add(className)
      }
    }
  }, [printSections])

  const setPrintWithImages = (printWithImages: boolean) => {
    if (printWithImages) {
      document.documentElement.classList.remove(className)
    } else {
      document.documentElement.classList.add(className)
    }
    internalSetPrintWithImages(printWithImages)
  }

  return { printWithImages, setPrintWithImages, printSections, setPrintSections }
}
