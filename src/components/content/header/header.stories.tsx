import type { Meta, StoryObj } from '@storybook/react-vite'
import { Header, type HeaderInterfaceRef } from './header'
import { useRef } from 'react'
import { SceneContext } from '../scene-context'

const meta: Meta<typeof Header> = {
  title: 'Content/Header',
  component: Header,
}

export default meta
type Story = StoryObj<typeof Header>

export const Default: Story = {
  render: function Render() {
    const ref = useRef<HeaderInterfaceRef>(null)
    return (
      <SceneContext.Provider
        value={{
          webScene: null,
          webGlEnabled: true,
          setWebGlEnabled: () => {},
        }}
      >
        <div className="relative h-full w-full">
          <Header ref={ref} />
        </div>
      </SceneContext.Provider>
    )
  },
}
