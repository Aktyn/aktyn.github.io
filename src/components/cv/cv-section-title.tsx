import { type PropsWithChildren } from 'react'

export function CvSectionTitle({ children }: PropsWithChildren) {
  return (
    <h3
      className="
        mb-2 flex flex-row items-center gap-[2mm] border-b
        border-foreground-complementary pb-1 text-xs font-bold tracking-widest
        whitespace-nowrap text-neutral-900 uppercase
      "
    >
      {children}
    </h3>
  )
}
