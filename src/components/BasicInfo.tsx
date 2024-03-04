import { TypeInEffect } from './common/TypeInEffect'

import 'common-styles/typography.scss'

export const BasicInfo = () => {
  return (
    <div>
      {/* <header className="App-header">
        Type in effect showing my name and basic info (like in business card)
      </header> */}
      <TypeInEffect className="text-large">Aktyn</TypeInEffect>
    </div>
  )
}
