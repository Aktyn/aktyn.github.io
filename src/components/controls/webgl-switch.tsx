import { type ComponentProps, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from '~/components/common/switch'
import { SceneContext } from '../content/scene-context'

export function WebGlSwitch(props: ComponentProps<'div'>) {
  const { webGlEnabled, setWebGlEnabled } = useContext(SceneContext)
  const { t } = useTranslation()

  return (
    <Switch
      {...props}
      id="webgl-switch"
      enabled={webGlEnabled}
      onChange={setWebGlEnabled}
      label={t('header.webglSwitch.toggle')}
    />
  )
}
