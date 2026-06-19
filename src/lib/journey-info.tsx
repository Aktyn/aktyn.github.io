import type { ComponentProps } from 'react'
import { type Images } from '~/components/content/sections/common/images-strip'
import type { SvgIcon } from '~/icons/material-symbol-icons'

export enum JourneySection {
  Education = 'education',
  WorkExperience = 'work-experience',
  FreeTimeProjects = 'free-time-projects',
}

export const journeyInfo = {
  [JourneySection.Education]: {
    title: 'Education',
    thumbnail: '/img/quick-access-thumbnails/diploma.webp',
    icon: 'School',
    images: [
      { full: '/img/journey/diploma.webp', preview: '/img/journey/diploma-preview.webp' },
      // --------------------------------------------------
      {
        full: '/img/computer-graphics/table-tennis.webp',
        preview: '/img/computer-graphics/table-tennis-preview.webp',
      },
      {
        full: '/img/computer-graphics/psyduck.webp',
        preview: '/img/computer-graphics/psyduck-preview.webp',
      },
      {
        full: '/img/computer-graphics/fafik_2.webp',
        preview: '/img/computer-graphics/fafik_2-preview.webp',
      },
      {
        full: '/img/computer-graphics/old_ball.webp',
        preview: '/img/computer-graphics/old_ball-preview.webp',
      },
      {
        full: '/img/computer-graphics/hairy-logo-v1-postprocess.webp',
        preview: '/img/computer-graphics/hairy-logo-v1-postprocess-preview.webp',
      },
      {
        full: '/img/computer-graphics/neon_logo_wallpaper.webp',
        preview: '/img/computer-graphics/neon_logo_wallpaper-preview.webp',
      },
      {
        full: '/img/computer-graphics/sniadanko.webp',
        preview: '/img/computer-graphics/sniadanko-preview.webp',
      },
    ],
  },
  [JourneySection.WorkExperience]: {
    title: 'Work experience',
    thumbnail: '/img/quick-access-thumbnails/linkedin.webp',
    icon: 'Work',
    images: [],
  },
  [JourneySection.FreeTimeProjects]: {
    title: 'Free time projects',
    thumbnail: '/img/quick-access-thumbnails/web-scraper.webp',
    icon: 'PersonHeart',
    images: [
      {
        full: '/img/journey/graphics-aspirations.webp',
        preview: '/img/journey/graphics-aspirations-preview.webp',
      },
    ],
  },
} as const satisfies {
  [key in JourneySection]: {
    title: string
    thumbnail: string
    images: Images
    icon: ComponentProps<typeof SvgIcon>['icon'] | { svgPath: string }
  }
}
