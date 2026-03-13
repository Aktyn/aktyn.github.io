import type { Meta, StoryObj } from '@storybook/react-vite'
import { QuickAccess } from './quick-access'

const meta: Meta<typeof QuickAccess> = {
  title: 'Sections/Intro/QuickAccess',
  component: QuickAccess,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof QuickAccess>

export const Default: Story = {
  render: () => <QuickAccess />,
}
