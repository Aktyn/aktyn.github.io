import type { Meta, StoryObj } from "@storybook/react-vite"
import { GithubIcon } from "./GithubIcon"
import { LinkedInIcon } from "./LinkedInIcon"

const meta: Meta = {
  title: "Components/Icons",
  parameters: {
    layout: "centered",
  },
}

export default meta

export const Github: StoryObj<typeof GithubIcon> = {
  render: (args) => <GithubIcon {...args} className="size-16" />,
}

export const LinkedIn: StoryObj<typeof LinkedInIcon> = {
  render: (args) => <LinkedInIcon {...args} className="size-16" />,
}
