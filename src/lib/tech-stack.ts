import { useMemo, type ComponentProps } from 'react'
import { type SvgIcon } from '~/icons/material-symbol-icons'
import { useTranslation } from 'react-i18next'

export enum TechStackCategory {
  Frontend = 'frontend',
  Backend = 'backend',
  KnownTools = 'known-tools',
}

export type TechStackInfoSchema = {
  [key in TechStackCategory]: {
    title: string
    description: string
    thumbnail: string
    icon: ComponentProps<typeof SvgIcon>['icon'] | { svgPath: string }
    stackGroups: Array<{
      title: string
      stack: Array<keyof typeof techStack>
    }>
  }
}

export const useTechStackInfo = () => {
  const { t } = useTranslation()

  return useMemo<TechStackInfoSchema>(
    () => ({
      [TechStackCategory.Frontend]: {
        title: t('techStack.frontend.title'),
        description: t('techStack.frontend.desc'),
        thumbnail: '/img/quick-access-thumbnails/react.webp',
        icon: 'Devices',
        stackGroups: [
          {
            title: t('techStack.frontend.groups.languages'),
            stack: ['html', 'javascript', 'typescript'],
          },
          {
            title: t('techStack.frontend.groups.frameworks'),
            stack: ['react', 'vite', 'webpack', 'electron'],
          },
          {
            title: t('techStack.frontend.groups.styling'),
            stack: ['css', 'sass', 'tailwindcss', 'shadcn', 'materialui'],
          },
          {
            title: t('techStack.frontend.groups.graphics'),
            stack: ['svg', 'threejs', 'opengl+webgl', 'glsl'],
          },
          {
            title: t('techStack.frontend.groups.testing'),
            stack: ['vitest', 'jest', 'storybook'],
          },
          {
            title: t('techStack.frontend.groups.mobile'),
            stack: ['react-native', 'expo'],
          },
        ],
      },
      [TechStackCategory.Backend]: {
        title: t('techStack.backend.title'),
        description: t('techStack.backend.desc'),
        thumbnail: '/img/quick-access-thumbnails/nodejs.webp',
        icon: 'Terminal',
        stackGroups: [
          {
            title: t('techStack.backend.groups.languages'),
            stack: ['python', 'java', 'cplusplus'],
          },
          {
            title: t('techStack.backend.groups.runtimes'),
            stack: ['nodejs', 'fastify', 'express', 'puppeteer'],
          },
          {
            title: t('techStack.backend.groups.databases'),
            stack: ['postgresql', 'sqlite', 'mongodb'],
          },
          {
            title: t('techStack.backend.groups.microcontrollers'),
            stack: ['raspberrypi', 'micropython'],
          },
        ],
      },
      [TechStackCategory.KnownTools]: {
        title: t('techStack.knownTools.title'),
        description: t('techStack.knownTools.desc'),
        thumbnail: '/img/quick-access-thumbnails/jira.webp',
        icon: 'Construction',
        stackGroups: [
          {
            title: t('techStack.knownTools.groups.graphics'),
            stack: ['blender', 'gimp', 'inkscape', 'figma'],
          },
          {
            title: t('techStack.knownTools.groups.management'),
            stack: ['jira', 'linear', 'git', 'github', 'gitlab'],
          },
        ],
      },
    }),
    [t],
  )
}

export const techStack = {
  html: {
    icon: 'devicon-html5-plain colored',
    name: 'HTML',
  },
  javascript: {
    icon: 'devicon-javascript-plain colored',
    name: 'JavaScript',
  },
  typescript: {
    icon: 'devicon-typescript-plain colored',
    name: 'TypeScript',
  },
  react: {
    icon: 'devicon-react-original colored',
    name: 'React',
  },
  vite: {
    icon: 'devicon-vitejs-plain colored',
    name: 'Vite',
  },
  css: {
    icon: 'devicon-css3-plain-wordmark colored',
    name: 'CSS',
  },
  sass: {
    icon: 'devicon-sass-original colored',
    name: 'Sass',
  },
  tailwindcss: {
    icon: 'devicon-tailwindcss-original colored',
    name: 'Tailwind',
  },
  shadcn: {
    icon: '',
    name: 'Shadcn',
  },
  materialui: {
    icon: 'devicon-materialui-plain colored',
    name: 'Material UI',
  },
  webpack: {
    icon: 'devicon-webpack-plain colored',
    name: 'Webpack',
  },
  express: {
    icon: 'devicon-express-original',
    name: 'Express',
  },
  fastify: {
    icon: 'devicon-fastify-plain',
    name: 'Fastify',
  },
  'react-native': {
    icon: 'devicon-react-original colored',
    name: 'React Native',
  },
  expo: {
    icon: 'devicon-expo-original',
    name: 'Expo + EAS',
  },
  mysql: {
    icon: 'devicon-mysql-plain colored',
    name: 'MySQL',
  },
  postgresql: {
    icon: 'devicon-postgresql-plain colored',
    name: 'PostgreSQL',
  },
  sqlite: {
    icon: 'devicon-sqlite-plain colored',
    name: 'SQLite',
  },
  discordjs: {
    icon: 'devicon-discordjs-plain',
    name: 'Discord.js',
  },
  nodejs: {
    icon: 'devicon-nodejs-plain colored',
    name: 'Node.js',
  },
  electron: {
    icon: 'devicon-electron-original',
    name: 'Electron',
  },
  puppeteer: {
    icon: 'devicon-puppeteer-plain colored',
    name: 'Puppeteer',
  },
  mongodb: {
    icon: 'devicon-mongodb-plain colored',
    name: 'MongoDB',
  },
  java: {
    icon: 'devicon-java-plain colored',
    name: 'Java',
  },
  opengl: {
    icon: 'devicon-opengl-plain colored',
    name: 'OpenGL',
  },
  blender: {
    icon: 'devicon-blender-original colored',
    name: 'Blender',
  },
  gimp: {
    icon: 'devicon-gimp-plain colored',
    name: 'GIMP',
  },
  inkscape: {
    icon: 'devicon-inkscape-plain',
    name: 'Inkscape',
  },
  raspberrypi: {
    icon: 'devicon-raspberrypi-plain colored',
    name: 'Raspberry Pi',
  },
  python: {
    icon: 'devicon-python-plain colored',
    name: 'Python',
  },
  micropython: {
    icon: 'devicon-python-plain',
    name: 'MicroPython',
  },
  cplusplus: {
    icon: 'devicon-cplusplus-plain colored',
    name: 'C++',
  },
  threejs: {
    icon: 'devicon-threejs-original',
    name: 'Three.js',
  },
  'opengl+webgl': {
    icon: 'devicon-opengl-plain colored',
    name: 'OpenGL + WebGL',
  },
  glsl: {
    icon: '',
    name: 'GLSL',
  },
  svg: {
    icon: '',
    name: 'SVG',
  },
  figma: {
    icon: 'devicon-figma-plain colored',
    name: 'Figma',
  },
  jira: {
    icon: 'devicon-jira-plain colored',
    name: 'Jira',
  },
  linear: {
    icon: '',
    name: 'Linear',
  },
  jest: {
    icon: 'devicon-jest-plain colored',
    name: 'Jest',
  },
  vitest: {
    icon: 'devicon-vitest-plain colored',
    name: 'Vitest',
  },
  storybook: {
    icon: 'devicon-storybook-plain colored',
    name: 'Storybook',
  },
  git: {
    icon: 'devicon-git-plain colored',
    name: 'Git',
  },
  github: {
    icon: 'devicon-github-plain',
    name: 'GitHub',
  },
  gitlab: {
    icon: 'devicon-gitlab-plain colored',
    name: 'GitLab',
  },
} as const satisfies Record<
  string,
  {
    icon: string
    name: string
  }
>
