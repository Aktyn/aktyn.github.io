import { FileUser } from 'lucide-react'
import { useMemo } from 'react'
import { isWebglAvailable } from '~/graphics/graphics-helpers'
import { contentViewportID, LOGO_PATH } from '~/lib/consts'
import { cn } from '~/lib/utils'
import { ProjectedButton } from './projected-button'
import { ProjectedIcon } from './projected-icon'
import { ProjectedText } from './projected-text'
import { SceneProvider, type SceneProviderProps } from './scene-provider'

export function ContentLayer({ webScene }: Pick<SceneProviderProps, 'webScene'>) {
  const webGLAvailable = useMemo(() => isWebglAvailable(), [])

  return (
    <SceneProvider webScene={webScene}>
      <div
        id={contentViewportID}
        className={cn(
          'pointer-events-auto no-scrollbar block h-screen w-full overflow-auto print:**:[span]:text-[#001814] print:**:[svg]:fill-[#001814]',
          webGLAvailable && 'not-print:fill-transparent not-print:text-transparent',
        )}
      >
        <header className="flex w-full flex-row items-center justify-end p-2">
          <button
            className="flex cursor-pointer flex-row items-center gap-2 rounded-lg px-2 py-1 text-foreground transition-colors hover:bg-foreground/20 print:hidden *:[svg]:size-4"
            onClick={() => window.print()}
          >
            <FileUser />
            Print or download <b title="Curriculum Vitae">CV</b>
          </button>
        </header>
        <div className="mt-30 text-center">
          <ProjectedText text="Aktyn" fontSize={96} fontWeight="bold" />
        </div>
        <p className="px-20 break-normal whitespace-break-spaces">
          <ProjectedText
            text="Another text, multi word sentence"
            fontSize={84}
            fontWeight="light"
          />
        </p>
        <div className="flex flex-col items-center gap-16 text-center">
          <ProjectedIcon path={LOGO_PATH} size={128} />
          <div>
            <ProjectedText text="Visibility test" fontSize={64} />
          </div>
          <div>
            <ProjectedButton text="Button test" fontSize={64} />
          </div>
        </div>
      </div>
    </SceneProvider>
  )
}
