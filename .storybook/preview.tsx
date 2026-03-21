import type { Preview } from '@storybook/react-vite'
import { Suspense, useEffect, useRef } from 'react'
import type { PartialStoryFn } from 'storybook/internal/types'
import { TooltipProvider } from '../src/components/common/tooltip'
import { useEntryAnimations } from '../src/hooks/useEntryAnimations'
import { I18nextProvider } from 'react-i18next'
import type { StoryContext } from '@storybook/react'
import i18n from '../src/i18n'

import 'devicon/devicon.min.css'
import '../src/index.css'

const I18nDecorator = (Story: PartialStoryFn, context: StoryContext) => {
  const { locale } = context.globals
  useEffect(() => {
    void i18n.changeLanguage(locale)
  }, [locale])

  return (
    <Suspense fallback={<div>Loading translations...</div>}>
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    </Suspense>
  )
}

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
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', right: 'EN', title: 'English' },
          { value: 'pl', right: 'PL', title: 'Polski' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'dark' },
    locale: 'en',
  },
  decorators: [I18nDecorator, AnimationDecorator],
}

export default preview
