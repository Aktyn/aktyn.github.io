import type { Preview } from '@storybook/react-vite'
import { useRef } from 'react'
import type { PartialStoryFn } from 'storybook/internal/types'
import { TooltipProvider } from '../src/components/common/tooltip'
import { useEntryAnimations } from '../src/hooks/useEntryAnimations'

import '../src/index.css'

const AnimationDecorator = (Story: PartialStoryFn) => {
  const ref = useRef<HTMLDivElement>(null)
  useEntryAnimations(ref)

  return (
    <div
      className="storybook-root"
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <Story />
      </TooltipProvider>
      <div ref={ref} />
    </div>
  )
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        default: { name: 'Dark', value: 'var(--color-background-visual)' },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    layout: 'fullscreen',
  },
  initialGlobals: {
    backgrounds: { value: 'dark' },
  },
  decorators: [AnimationDecorator],
}

export default preview
