import type { Meta, StoryObj } from '@storybook/react-vite'
import { Diploma } from './diploma'

const meta: Meta<typeof Diploma> = {
  title: 'Sections/Journey/Diploma',
  component: Diploma,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof Diploma>

export const Default: Story = {
  render: () => <Diploma />,
}
