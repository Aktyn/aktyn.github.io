import { useContext, type FC, type PropsWithChildren } from 'react'
import clsx from 'clsx'
import { SectionContext, type Section } from 'context/SectionContext'
import './SectionContainer.scss'

export const SectionContainer: FC<PropsWithChildren<{ section: Section }>> = ({
  children,
  section,
}) => {
  const { previousSection, nextSection } = useContext(SectionContext)

  return (
    <div
      className={clsx('section-container', section)}
      onWheel={(event) => {
        if (event.deltaY > 0) {
          nextSection()
        } else if (event.deltaY < 0) {
          previousSection()
        }
      }}
    >
      <div className="section-content">{children}</div>
    </div>
  )
}
