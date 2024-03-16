import type { FC, PropsWithChildren } from 'react'
import { mdiLink } from '@mdi/js'
import Icon from '@mdi/react'

export const RepositoryInfo: FC<PropsWithChildren<{ link: string }>> = ({ link, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
    <div>{children}</div>
    <div className="divider" style={{ height: '1px', width: '100%' }} />
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
      }}
    >
      Repository <Icon path={mdiLink} size="1rem" />
    </a>
  </div>
)
