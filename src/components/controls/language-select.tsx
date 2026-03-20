import { type ComponentProps, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'

const options = [
  { value: 'en', label: '🇬🇧 EN' },
  { value: 'pl', label: '🇵🇱 PL' },
]

export function LanguageSelect(props: ComponentProps<'div'>) {
  const { i18n } = useTranslation()

  const [open, setOpen] = useState(false)

  return (
    <div
      {...props}
      aria-label="Language selector"
      className={cn(
        'relative flex flex-row items-center self-stretch rounded-lg border border-foreground/20 bg-transparent text-sm font-semibold text-foreground transition-colors print:hidden',
        open
          ? 'border-foreground-complementary'
          : 'cursor-pointer hover:bg-foreground/20 hover:**:[svg]:translate-x-0 hover:**:[svg]:opacity-100',
        props.className,
      )}
      onClick={() => setOpen(true)}
    >
      <div
        className={cn(
          'flex h-full w-14 flex-row items-stretch overflow-hidden transition-[width] *:min-w-14 *:flex-1',
          i18n.language === 'pl' ? 'justify-end' : 'justify-start',
          open && 'w-28',
        )}
      >
        {options.map((option) => (
          <button
            key={option.value}
            onClick={(event) => {
              void i18n.changeLanguage(option.value)
              event.stopPropagation()
              setOpen(false)
            }}
            className={cn(
              'py-1 whitespace-nowrap transition-colors',
              open ? 'hover:bg-foreground-complementary/20' : 'pointer-events-none',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <span className="absolute inset-y-0 left-full flex h-full w-5 items-center justify-center">
        <SvgIcon
          icon="ChevronLeft"
          className="size-5 -translate-x-1 rotate-180 opacity-0 transition-[translate,opacity]"
        />
      </span>
      <span className="absolute inset-y-0 right-full flex h-full w-5 items-center justify-center">
        <SvgIcon
          icon="ChevronLeft"
          className="size-5 translate-x-1 opacity-0 transition-[translate,opacity]"
        />
      </span>
    </div>
  )
}
