import type { Meta, StoryObj } from '@storybook/react-vite'
import { QuickProjectInfo } from './quick-project-info'

const meta: Meta<typeof QuickProjectInfo> = {
  title: 'Sections/Journey/QuickProjectInfo',
  component: QuickProjectInfo,
  parameters: {
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj<typeof QuickProjectInfo>

export const Default: Story = {
  args: {
    title: 'Test Project',
    description:
      'This is a description for the test project. It can be quite long, demonstrating how the component handles text wrapping and layout. It also provides good context.',
    githubLink: 'https://github.com/Aktyn/test-project',
  },
}

export const WithoutDescription: Story = {
  args: {
    title: 'Minimal Project',
    githubLink: 'https://github.com/Aktyn/minimal',
  },
}

export const AsListItem: Story = {
  args: {
    component: 'li',
    title: 'List Item Project',
    description: 'This project is rendered as a list item (li element).',
    githubLink: 'https://github.com/Aktyn/list-item-project',
  },
  render: (args) => (
    <ul className="ml-6 list-disc">
      <QuickProjectInfo {...args} />
      <QuickProjectInfo {...args} title="Second Project" />
      <QuickProjectInfo {...args} title="Third Project" />
    </ul>
  ),
}
