import { type ReactNode, type ComponentProps } from 'react'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'

type SwitchPropsBase = {
  id: string
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: ReactNode
}

type SwitchProps = SwitchPropsBase & Omit<ComponentProps<'button'>, keyof SwitchPropsBase>

export function Switch({ id, enabled, onChange, label, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      {...props}
      className={cn(
        `
          flex cursor-pointer flex-row-reverse flex-wrap items-center
          justify-end gap-x-1 gap-y-0.5 overflow-hidden
          hover:**:data-[slot=switch-track]:bg-foreground-lighter
        `,
        props.className,
      )}
      onClick={() => onChange(!enabled)}
    >
      {label && (
        <span className="text-sm font-medium text-ellipsis whitespace-nowrap">{label}</span>
      )}
      <input
        id={id}
        type="checkbox"
        checked={enabled}
        hidden
        onChange={(e) => onChange(e.target.checked)}
        aria-hidden="true"
        tabIndex={-1}
      />
      <span
        className={cn(
          'flex w-9 flex-row items-center rounded-full p-1 transition-colors',
          enabled ? 'bg-background/80' : 'bg-background/40',
        )}
        aria-hidden="true"
      >
        <span
          data-slot="switch-track"
          className={cn(
            `
              inline-flex size-3 items-center justify-center rounded-full
              bg-foreground/50 text-center text-xs text-red-300
              transition-[background-color,translate] duration-spring
              ease-spring
            `,
            enabled
              ? `
                translate-x-4 bg-foreground fill-black
                *:scale-100
              `
              : `
                translate-x-0 bg-foreground/50 fill-black/0
                *:scale-golden-inverse
              `,
          )}
        >
          <SvgIcon icon="Check" className="size-2.5 transition-[fill,scale]" />
        </span>
      </span>
    </button>
  )
}
