import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sidebar } from './sidebar'
import { useRef } from 'react'

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
}

export default meta
type Story = StoryObj<typeof Sidebar>

export const Default: Story = {
  render: function Render() {
    const ref = useRef<HTMLDivElement>(null)
    return (
      <div className="flex h-dvh w-full overflow-auto">
        <Sidebar sectionsContainerRef={ref} />
        <div
          ref={ref}
          className="ml-4 h-[200vh] w-full border border-dashed border-foreground/30 bg-foreground/5 p-8"
        >
          Scroll container placeholder
        </div>
      </div>
    )
  },
}
