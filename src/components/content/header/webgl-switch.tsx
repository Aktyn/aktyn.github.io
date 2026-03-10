import { type ComponentProps, useContext } from 'react'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'
import { SceneContext } from '../scene-context'

export function WebGlSwitch(props: ComponentProps<'div'>) {
  const { webGlEnabled, setWebGlEnabled } = useContext(SceneContext)

  return (
    <div
      {...props}
      className={cn(
        'flex flex-row-reverse flex-wrap items-center justify-end gap-x-1 gap-y-0.5 overflow-hidden *:cursor-pointer',
        props.className,
      )}
    >
      <label htmlFor="webgl-switch" className="text-sm font-medium text-ellipsis whitespace-nowrap">
        Toggle advanced graphic effects
      </label>
      <input
        id="webgl-switch"
        type="checkbox"
        checked={webGlEnabled}
        hidden
        onChange={(e) => setWebGlEnabled(e.target.checked)}
      />
      <div
        className={cn(
          'flex w-9 flex-row items-center rounded-full p-1 transition-colors hover:*:bg-foreground-lighter',
          webGlEnabled ? 'bg-background/80' : 'bg-background-visual',
        )}
        onClick={() => setWebGlEnabled(!webGlEnabled)}
      >
        <span
          className={cn(
            'inline-flex size-3 items-center justify-center rounded-full bg-foreground/50 text-center text-xs text-red-300 transition-[background-color,translate] duration-spring ease-spring',
            webGlEnabled
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
