import { mdiAccountHardHat } from '@mdi/js'
import Icon from '@mdi/react'
import 'common-styles/typography.scss'
import './ComputerGraphics.scss'

export const ComputerGraphics = () => {
  return (
    <div className="computer-graphics-main">
      <Icon path={mdiAccountHardHat} size="8rem" />
      <div className="text-large">Under development</div>
    </div>
  )
}
