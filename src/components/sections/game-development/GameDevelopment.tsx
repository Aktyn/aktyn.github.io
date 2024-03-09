import { mdiAccountHardHat } from '@mdi/js'
import Icon from '@mdi/react'
import 'common-styles/typography.scss'
import './GameDevelopment.scss'

export const GameDevelopment = () => {
  return (
    <div className="game-development-main">
      <Icon path={mdiAccountHardHat} size="8rem" />
      <div className="text-large">Under development</div>
    </div>
  )
}
