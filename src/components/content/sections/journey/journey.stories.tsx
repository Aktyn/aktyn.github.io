import type { Meta, StoryObj } from '@storybook/react-vite'
import { Journey } from './journey'

const meta: Meta<typeof Journey> = {
  title: 'Sections/Journey/Journey',
  component: Journey,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof Journey>

export const Default: Story = {
  render: () => <Journey />,
}
