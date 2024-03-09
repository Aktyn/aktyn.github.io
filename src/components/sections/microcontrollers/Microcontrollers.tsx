import { mdiAccountHardHat } from '@mdi/js'
import Icon from '@mdi/react'
import 'common-styles/typography.scss'
import './Microcontrollers.scss'

export const Microcontrollers = () => {
  return (
    <div className="microcontrollers-main">
      <Icon path={mdiAccountHardHat} size="8rem" />
      <div className="text-large">Under development</div>
    </div>
  )
}
