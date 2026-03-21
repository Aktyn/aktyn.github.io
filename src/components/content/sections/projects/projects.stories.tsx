import type { Meta, StoryObj } from '@storybook/react-vite'
import { Projects } from './projects'

const meta: Meta<typeof Projects> = {
  title: 'Sections/Projects/Projects',
  component: Projects,
}

export default meta
type Story = StoryObj<typeof Projects>

export const Default: Story = {
  render: () => (
    <div className="max-h-screen overflow-auto p-8">
      <Projects />
    </div>
  ),
}
