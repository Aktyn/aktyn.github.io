import { mdiAccountHardHat } from '@mdi/js'
import Icon from '@mdi/react'
import 'common-styles/typography.scss'
import './Websites.scss'

export const Websites = () => {
  return (
    <div className="websites-main">
      <Icon path={mdiAccountHardHat} size="8rem" />
      <div className="text-large">Under development</div>
      {/* some info about technologies */}
      {/* not only websites but web/electron applications */}
    </div>
  )
}
