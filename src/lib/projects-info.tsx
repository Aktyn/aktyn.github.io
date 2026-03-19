import { useMemo, type ComponentProps, type ReactNode } from 'react'
import type { SvgIcon } from '~/icons/material-symbol-icons'
import type { techStack } from '~/lib/tech-stack'
import type { ExtendArray } from '~/lib/types'
import { useTranslation } from 'react-i18next'

export enum ProjectsGroup {
  WebDevelopment = 'web-development',
  GameDevelopment = 'game-development',
  ComputerGraphics = 'computer-graphics',
  RaspberryPi = 'raspberry-pi',
}

export type ProjectSchema = {
  title: string
  description: ReactNode
  linkToGithubRepo: ExtendArray<`https://github.com/Aktyn/${string}`> | null
  images: string[]
  techStack?: Array<keyof typeof techStack>
}

export type ProjectsGroupInfoSchema = {
  title: string
  thumbnail: string
  description: string
  icon: ComponentProps<typeof SvgIcon>['icon']
  projects: Array<ProjectSchema>
}

export function useProjectsGroupsInfo(): Record<ProjectsGroup, ProjectsGroupInfoSchema> {
  const { t } = useTranslation()

  return useMemo(
    () => ({
      [ProjectsGroup.WebDevelopment]: {
        title: t('projectsInfo.webDev.title'),
        thumbnail: '/img/quick-access-thumbnails/web-dev.webp',
        description: t('projectsInfo.webDev.desc'),
        icon: 'Web',
        projects: [
          {
            title: 'In2RP website',
            description: t('projectsInfo.webDev.projects.in2rp.desc'),
            linkToGithubRepo: 'https://github.com/Aktyn/in2rp_homepage',
            images: [
              '/img/websites/in2rp/1.webp',
              '/img/websites/in2rp/2.webp',
              '/img/websites/in2rp/3.webp',
              '/img/websites/in2rp/4.webp',
              '/img/websites/in2rp/5.webp',
              '/img/websites/in2rp/6.webp',
            ],
            techStack: ['typescript', 'react', 'sass', 'webpack', 'express', 'mysql', 'discordjs'],
          },
          {
            title: 'FiveM launcher',
            description: t('projectsInfo.webDev.projects.fivem.desc'),
            linkToGithubRepo: 'https://github.com/Aktyn/fivem-launcher',
            images: ['/img/websites/fivem-launcher.webp'],
            techStack: ['nodejs', 'electron', 'typescript', 'react', 'sass', 'webpack'],
          },
          {
            title: 'Project Paradise',
            description: t('projectsInfo.webDev.projects.paradise.desc'),
            linkToGithubRepo: 'https://github.com/Aktyn/ProjectParadise',
            images: ['/img/websites/project-paradise.webp'],
            techStack: ['typescript', 'react', 'sass', 'webpack'],
          },
          {
            title: 'Map POI',
            description: t('projectsInfo.webDev.projects.mapPoi.desc'),
            linkToGithubRepo: 'https://github.com/Aktyn/React-Map-POI',
            images: ['/img/websites/map-poi/1.webp', '/img/websites/map-poi/2.webp'],
            techStack: ['typescript', 'react', 'sass', 'webpack'],
          },
        ],
      },
      [ProjectsGroup.GameDevelopment]: {
        title: t('projectsInfo.gameDev.title'),
        thumbnail: '/img/quick-access-thumbnails/game-dev.webp',
        description: t('projectsInfo.gameDev.desc'),
        icon: 'Gamepad',
        projects: [
          {
            title: 'Berta Snakes',
            description: t('projectsInfo.gameDev.projects.berta.desc'),
            linkToGithubRepo: 'https://github.com/Aktyn/BertaSnakes',
            images: [
              '/img/games/berta-snakes/1.webp',
              '/img/games/berta-snakes/2.webp',
              '/img/games/berta-snakes/3.webp',
              '/img/games/berta-snakes/4.webp',
              '/img/games/berta-snakes/5.webp',
            ],
            techStack: ['typescript', 'react', 'sass', 'webpack', 'express', 'mongodb'],
          },
          {
            title: 'Kulka w tarapatach',
            description: t('projectsInfo.gameDev.projects.kulka.desc'),
            linkToGithubRepo: 'https://github.com/Aktyn/kulka-w-tarapatach',
            images: [
              '/img/games/kulka-w-tarapatach/1.webp',
              '/img/games/kulka-w-tarapatach/2.webp',
              '/img/games/kulka-w-tarapatach/3.webp',
              '/img/games/kulka-w-tarapatach/4.webp',
              '/img/games/kulka-w-tarapatach/5.webp',
            ],
            techStack: ['java', 'opengl'],
          },
          {
            title: 'Astro kulka',
            description: t('projectsInfo.gameDev.projects.astro.desc'),
            linkToGithubRepo: null,
            images: ['/img/games/astro-kulka.webp'],
            techStack: ['java', 'opengl'],
          },
          {
            title: 'Tetris widget',
            description: t('projectsInfo.gameDev.projects.tetris.desc'),
            linkToGithubRepo: 'https://github.com/Aktyn/Tetris-widget',
            images: ['/img/games/tetris.webp'],
            techStack: ['javascript', 'typescript'],
          },
          {
            title: 'Ten tac toe',
            description: (
              <>
                {t('projectsInfo.gameDev.projects.tentactoe.desc1')}
                <br />
                {t('projectsInfo.gameDev.projects.tentactoe.desc2')}
                <br />
              </>
            ),
            linkToGithubRepo: 'https://github.com/Aktyn/Ten-tac-toe',
            images: ['/img/games/ten-tac-toe.webp'],
            techStack: ['html', 'javascript'],
          },
          {
            title: 'ZeroG Ball',
            description: t('projectsInfo.gameDev.projects.zerog.desc'),
            linkToGithubRepo: 'https://github.com/Aktyn/ZeroG-Ball',
            images: [
              '/img/games/zero-g-ball/1.webp',
              '/img/games/zero-g-ball/2.webp',
              '/img/games/zero-g-ball/3.webp',
              '/img/games/zero-g-ball/4.webp',
              '/img/games/zero-g-ball/5.webp',
            ],
            techStack: ['javascript', 'webpack', 'electron'],
          },
        ],
      },
      [ProjectsGroup.ComputerGraphics]: {
        title: t('projectsInfo.compGraphics.title'),
        thumbnail: '/img/quick-access-thumbnails/computer-graphics.webp',
        description: t('projectsInfo.compGraphics.desc'),
        icon: 'PhotoLibrary',
        projects: [
          {
            title: 'Blender renders',
            description: (
              <>
                {t('projectsInfo.compGraphics.projects.blender.desc1')}
                <br />
                {t('projectsInfo.compGraphics.projects.blender.desc2')}
                <br />
                {t('projectsInfo.compGraphics.projects.blender.desc3')}
              </>
            ),
            linkToGithubRepo: 'https://github.com/Aktyn/Blender-portfolio',
            images: [
              '/img/computer-graphics/table-tennis.webp',
              '/img/computer-graphics/psyduck.webp',
              '/img/computer-graphics/fafik_2.webp',
              '/img/computer-graphics/old_ball.webp',
              '/img/computer-graphics/hairy-logo-v1-postprocess.webp',
              '/img/computer-graphics/neon_logo_wallpaper.webp',
              '/img/computer-graphics/sniadanko.webp',
            ],
            techStack: ['blender', 'gimp'],
          },
        ],
      },
      [ProjectsGroup.RaspberryPi]: {
        title: t('projectsInfo.rpi.title'),
        thumbnail: '/img/quick-access-thumbnails/raspberry-pi.webp',
        description: t('projectsInfo.rpi.desc'),
        icon: 'RaspberryPi',
        projects: [
          {
            title: 'Experimental robot',
            description: t('projectsInfo.rpi.projects.robot.desc'),
            linkToGithubRepo: null,
            images: ['/img/rpi-projects/robot.webp'],
            techStack: ['raspberrypi', 'python'],
          },
          {
            title: 'Cyclocomputer',
            description: t('projectsInfo.rpi.projects.cyclocomputer.desc'),
            linkToGithubRepo: [
              'https://github.com/Aktyn/Cyclocomputer-raspberry-pi-pico',
              'https://github.com/Aktyn/Cyclocomputer-mobile',
            ],
            images: [
              '/img/rpi-projects/cyclocomputer/1.webp',
              '/img/rpi-projects/cyclocomputer/2.webp',
              '/img/rpi-projects/cyclocomputer/3.webp',
            ],
            techStack: ['raspberrypi', 'python'],
          },
          {
            title: 'Bike Tour Assistant',
            description: t('projectsInfo.rpi.projects.biketour.desc'),
            linkToGithubRepo: 'https://github.com/Aktyn/Bike-Tour-Assistant',
            images: [
              '/img/rpi-projects/bike-tour-assistant/1.webp',
              '/img/rpi-projects/bike-tour-assistant/2.webp',
              '/img/rpi-projects/bike-tour-assistant/3.webp',
              '/img/rpi-projects/bike-tour-assistant/4.webp',
            ],
            techStack: ['raspberrypi', 'cplusplus'],
          },
          {
            title: 'Aktyn drone',
            description: t('projectsInfo.rpi.projects.drone.desc'),
            linkToGithubRepo: 'https://github.com/Aktyn/aktyn-drone',
            images: [
              '/img/rpi-projects/aktyn-drone/1.webp',
              '/img/rpi-projects/aktyn-drone/ui1.webp',
              '/img/rpi-projects/aktyn-drone/2.webp',
              '/img/rpi-projects/aktyn-drone/ui2.webp',
              '/img/rpi-projects/aktyn-drone/3.webp',
              '/img/rpi-projects/aktyn-drone/4.webp',
              '/img/rpi-projects/aktyn-drone/5.webp',
              '/img/rpi-projects/aktyn-drone/6.webp',
            ],
            techStack: ['raspberrypi', 'python', 'typescript', 'react'],
          },
        ],
      },
    }),
    [t],
  )
}
