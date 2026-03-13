import type { Meta, StoryObj } from '@storybook/react-vite'
import { QuickPersonalInfo } from './quick-personal-info'

const meta: Meta<typeof QuickPersonalInfo> = {
  title: 'Sections/Intro/QuickPersonalInfo',
  component: QuickPersonalInfo,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof QuickPersonalInfo>

export const Default: Story = {
  args: {
    experienceStartDate: new Date('2020-01-01'),
  },
}
