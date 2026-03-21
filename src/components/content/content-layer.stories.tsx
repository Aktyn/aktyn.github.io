import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContentLayer } from './content-layer'
import { SceneContext } from './scene-context'

const meta: Meta<typeof ContentLayer> = {
  title: 'Content/ContentLayer',
  component: ContentLayer,
}

export default meta
type Story = StoryObj<typeof ContentLayer>

export const Default: Story = {
  render: function Render() {
    return (
      <div className="relative h-dvh w-dvw overflow-hidden">
        <SceneContext.Provider
          value={{
            webScene: null,
            webGlEnabled: false,
            setWebGlEnabled: () => {},
          }}
        >
          <ContentLayer />
        </SceneContext.Provider>
      </div>
    )
  },
}
