import type { Meta, StoryObj } from '@storybook/react-vite'
import { TreeTimeline } from './tree-timeline'
import {
  freeTimeProjectsTimelineItems,
  schoolTimelineItems,
  universityTimelineItems,
  workExperienceTimelineItems,
} from './timeline-items'

const meta: Meta<typeof TreeTimeline> = {
  title: 'Sections/Journey/TimelineItems',
  component: TreeTimeline,
  parameters: {
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj<typeof TreeTimeline>

export const School: Story = {
  args: {
    header: <div className="mb-4 text-xl font-bold">School Timeline</div>,
    items: schoolTimelineItems,
  },
}

export const University: Story = {
  args: {
    header: <div className="mb-4 text-xl font-bold">University Timeline</div>,
    items: universityTimelineItems,
  },
}

export const WorkExperience: Story = {
  args: {
    header: <div className="mb-4 text-xl font-bold">Work Experience Timeline</div>,
    items: workExperienceTimelineItems,
  },
}

export const FreeTimeProjects: Story = {
  args: {
    header: <div className="mb-4 text-xl font-bold">Free Time Projects Timeline</div>,
    items: freeTimeProjectsTimelineItems,
  },
}
