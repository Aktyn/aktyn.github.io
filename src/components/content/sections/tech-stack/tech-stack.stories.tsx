import type { Meta, StoryObj } from '@storybook/react-vite'
import { TechStack } from './tech-stack'

const meta: Meta<typeof TechStack> = {
  title: 'Sections/TechStack/TechStack',
  component: TechStack,
}

export default meta
type Story = StoryObj<typeof TechStack>

export const Default: Story = {
  render: () => (
    <div className="max-h-screen overflow-auto p-8">
      <TechStack />
    </div>
  ),
}
