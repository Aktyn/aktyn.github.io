import type { Meta, StoryObj } from '@storybook/react-vite'
import { LanguageSelect } from './language-select'

const meta: Meta<typeof LanguageSelect> = {
  title: 'Controls/LanguageSelect',
  component: LanguageSelect,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof LanguageSelect>

export const Default: Story = {
  render: () => (
    <div>
      <LanguageSelect />
    </div>
  ),
}
