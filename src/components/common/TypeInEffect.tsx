import { type FC, type PropsWithChildren } from 'react'

export const TypeInEffect: FC<PropsWithChildren<{ className: string }>> = ({
  children,
  className,
}) => {
  return <div className={className}>{children}</div>
}
