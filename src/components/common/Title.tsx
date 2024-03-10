import { type FC, type PropsWithChildren } from 'react'
import { TypeInEffect, type TypeInfEffectProps } from './TypeInEffect'

import './Title.scss'

export const Title: FC<PropsWithChildren<TypeInfEffectProps>> = (props) => {
  return (
    <h1 className="title-main text-darken">
      <TypeInEffect className="text-large" {...props} />
    </h1>
  )
}
