import { useMemo } from 'react'
import { ProjectedText, type ProjectedTextProps } from './projected-text'
import { isWebglAvailable } from '~/graphics/graphics-helpers'
import { cn } from '~/lib/utils'

export function ContentLayer({ webScene }: Pick<ProjectedTextProps, 'webScene'>) {
  const webGLAvailable = useMemo(() => isWebglAvailable(), [])

  return (
    <div
      className={cn(
        'h-screen w-full overflow-hidden print:**:[span]:text-[#001814]',
        webGLAvailable && 'not-print:text-transparent',
      )}
    >
      <header className="flex w-full flex-row items-center justify-end p-4">
        <button className="cursor-pointer text-red-300 print:hidden" onClick={() => window.print()}>
          Print CV
        </button>
      </header>
      <div className="mt-40 text-center">
        <ProjectedText
          text="Aktyn"
          webScene={webScene}
          fontSize={96}
          fontWeight="bold"
          className="text-[#80CBC4]"
        />
      </div>
      <div className="px-20 break-normal whitespace-break-spaces">
        <ProjectedText
          text="Another text, multi word sentence"
          webScene={webScene}
          fontSize={84}
          fontWeight="light"
          className="text-[#80CBC4]"
        />
      </div>
    </div>
  )
}
