import type { Meta, StoryObj } from '@storybook/react-vite'
import { Intro } from './intro'
import { useRef } from 'react'

const meta: Meta<typeof Intro> = {
  title: 'Sections/Intro/Intro',
  component: Intro,
}

export default meta
type Story = StoryObj<typeof Intro>

export const Default: Story = {
  render: function Render() {
    const ref = useRef<HTMLDivElement>(null)
    return (
      <div className="flex min-h-screen flex-col items-center p-8">
        <Intro ref={ref} />
      </div>
    )
  },
}
