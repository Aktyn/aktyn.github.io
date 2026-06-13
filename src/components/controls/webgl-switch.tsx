import { type ComponentProps, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from '~/components/common/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../common/dialog'
import { SceneContext } from '../content/scene-context'
import { SvgIcon } from '~/icons/material-symbol-icons'

const performanceWarningShownKey = 'webgl-performance-warning-shown'

export function WebGlSwitch(props: ComponentProps<'div'>) {
  const { webGlEnabled, setWebGlEnabled } = useContext(SceneContext)
  const { t } = useTranslation()

  const [warningDialogOpen, setWarningDialogOpen] = useState(false)
  const [performanceWarningShown, setPerformanceWarningShown] = useState(
    () => localStorage.getItem(performanceWarningShownKey) === 'true',
  )

  const handleSwitchChange = (enable: boolean) => {
    if (enable && !performanceWarningShown) {
      setWarningDialogOpen(true)
    } else {
      setWebGlEnabled(enable)
    }
  }

  return (
    <Dialog
      open={warningDialogOpen}
      onOpenChange={webGlEnabled || performanceWarningShown ? undefined : setWarningDialogOpen}
    >
      <DialogTrigger asChild>
        <Switch
          {...props}
          id="webgl-switch"
          enabled={webGlEnabled}
          onChange={handleSwitchChange}
          label={t('header.webglSwitch.toggle')}
        />
      </DialogTrigger>
      <DialogContent className="border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SvgIcon icon="Warning" className="inline size-4" />
            {t('header.webglSwitch.warning.title')}
          </DialogTitle>
          <DialogDescription className="text-pretty text-foreground-lighter">
            {t('header.webglSwitch.warning.desc')}
          </DialogDescription>
        </DialogHeader>
        <button
          onClick={() => {
            setWebGlEnabled(true)
            localStorage.setItem(performanceWarningShownKey, 'true')
            setPerformanceWarningShown(true)
            setWarningDialogOpen(false)
          }}
          className="rounded-full border bg-background-lighter/25 text-base font-bold text-foreground-lighter transition-colors hover:bg-background-lighter"
        >
          {t('header.webglSwitch.warning.proceed')}
        </button>
      </DialogContent>
    </Dialog>
  )
}
