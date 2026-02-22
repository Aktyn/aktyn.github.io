import type { Meta, StoryObj } from "@storybook/react-vite"
import { Background } from "./background"

const meta = {
  title: "Background/Background",
  component: Background,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Background>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Background>
        <div>Background content</div>
      </Background>
    </div>
  ),
}
