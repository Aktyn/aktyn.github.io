import type { Meta, StoryObj } from '@storybook/react-vite'
import { MaximizedGallery } from './maximized-gallery'
import { useState } from 'react'

const meta: Meta<typeof MaximizedGallery> = {
  title: 'Gallery/MaximizedGallery',
  component: MaximizedGallery,
  parameters: {},
}

export default meta

type Story = StoryObj<typeof MaximizedGallery>

const mockImages = [
  'https://picsum.photos/id/1018/1000/600/',
  'https://picsum.photos/id/1015/1000/600/',
  'https://picsum.photos/id/1019/1000/600/',
]

const GalleryWithState = () => {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-foreground px-4 py-2 font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
      >
        Open Gallery
      </button>
      <MaximizedGallery
        open={open}
        onClose={() => setOpen(false)}
        images={mockImages}
        index={index}
        onIndexChange={setIndex}
      />
    </>
  )
}

export const Default: Story = {
  render: () => <GalleryWithState />,
}
