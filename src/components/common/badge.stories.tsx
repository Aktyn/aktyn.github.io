import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'Common/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  render: () => <Badge className="bg-foreground/20 px-3 py-1 text-sm">Badge Example</Badge>,
}
