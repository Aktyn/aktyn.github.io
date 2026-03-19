import type { Meta, StoryObj } from '@storybook/react-vite'
import { TreeTimeline } from './tree-timeline'
import {
  useFreeTimeProjectsTimelineItems,
  useSchoolTimelineItems,
  useUniversityTimelineItems,
  useWorkExperienceTimelineItems,
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

const SchoolTimeline = () => {
  const items = useSchoolTimelineItems()
  return (
    <TreeTimeline
      header={<div className="mb-4 text-xl font-bold">School Timeline</div>}
      items={items}
    />
  )
}

export const School: Story = {
  render: () => <SchoolTimeline />,
}

const UniversityTimeline = () => {
  const items = useUniversityTimelineItems()
  return (
    <TreeTimeline
      header={<div className="mb-4 text-xl font-bold">University Timeline</div>}
      items={items}
    />
  )
}

export const University: Story = {
  render: () => <UniversityTimeline />,
}

const WorkExperienceTimeline = () => {
  const items = useWorkExperienceTimelineItems()
  return (
    <TreeTimeline
      header={<div className="mb-4 text-xl font-bold">Work Experience Timeline</div>}
      items={items}
    />
  )
}

export const WorkExperience: Story = {
  render: () => <WorkExperienceTimeline />,
}

const FreeTimeProjectsTimeline = () => {
  const items = useFreeTimeProjectsTimelineItems()
  return (
    <TreeTimeline
      header={<div className="mb-4 text-xl font-bold">Free Time Projects Timeline</div>}
      items={items}
    />
  )
}

export const FreeTimeProjects: Story = {
  render: () => <FreeTimeProjectsTimeline />,
}
