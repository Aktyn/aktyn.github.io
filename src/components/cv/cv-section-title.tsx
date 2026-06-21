import { type PropsWithChildren } from 'react'

export function CvSectionTitle({ children }: PropsWithChildren) {
  return (
    <h3
      className="
        mb-2 border-b border-foreground-complementary pb-1 text-xs font-bold
        tracking-widest whitespace-nowrap text-neutral-900 uppercase
      "
    >
      {children}
    </h3>
  )
}
