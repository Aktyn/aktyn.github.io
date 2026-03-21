import type { Meta, StoryObj } from '@storybook/react-vite'
import { TechBadge } from './tech-badge'

const meta: Meta<typeof TechBadge> = {
  title: 'Badges/TechBadge',
  component: TechBadge,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof TechBadge>

export const Default: Story = {
  render: () => <TechBadge tech="react" />,
}
