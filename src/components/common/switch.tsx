import { type ReactNode, type ComponentProps } from 'react'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'

type SwitchPropsBase = {
  id: string
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: ReactNode
}

type SwitchProps = SwitchPropsBase & Omit<ComponentProps<'div'>, keyof SwitchPropsBase>

export function Switch({ id, enabled, onChange, label, ...props }: SwitchProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-row-reverse flex-wrap items-center justify-end gap-x-1 gap-y-0.5 overflow-hidden *:cursor-pointer',
        props.className,
      )}
    >
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ellipsis whitespace-nowrap">
          {label}
        </label>
      )}
      <input
        id={id}
        type="checkbox"
        checked={enabled}
        hidden
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        className={cn(
          'flex w-9 flex-row items-center rounded-full p-1 transition-colors hover:*:bg-foreground-lighter',
          enabled ? 'bg-background/80' : 'bg-background/40',
        )}
        onClick={() => onChange(!enabled)}
      >
        <span
          className={cn(
            'inline-flex size-3 items-center justify-center rounded-full bg-foreground/50 text-center text-xs text-red-300 transition-[background-color,translate] duration-spring ease-spring',
            enabled
              ? 'translate-x-4 bg-foreground fill-black *:scale-100'
              : 'translate-x-0 bg-foreground/50 fill-black/0 *:scale-golden-inverse',
          )}
        >
          <SvgIcon icon="Check" className="size-2.5 transition-[fill,scale]" />
        </span>
      </div>
    </div>
  )
}
