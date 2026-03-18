import { type ComponentProps, useContext } from 'react'
import { Switch } from '~/components/common/switch'
import { SceneContext } from '../scene-context'

export function WebGlSwitch(props: ComponentProps<'div'>) {
  const { webGlEnabled, setWebGlEnabled } = useContext(SceneContext)

  return (
    <Switch
      {...props}
      id="webgl-switch"
      enabled={webGlEnabled}
      onChange={setWebGlEnabled}
      label="Toggle advanced graphic effects"
    />
  )
}
