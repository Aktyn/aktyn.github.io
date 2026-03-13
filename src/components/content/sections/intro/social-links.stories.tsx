import type { Meta, StoryObj } from '@storybook/react-vite'
import { SocialLinks } from './social-links'

const meta: Meta<typeof SocialLinks> = {
  title: 'Sections/Intro/SocialLinks',
  component: SocialLinks,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof SocialLinks>

export const Default: Story = {
  render: () => <SocialLinks />,
}
