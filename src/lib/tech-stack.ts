import reactThumbnail from "~/img/quick-access-thumbnails/react.webp"
import nodejsThumbnail from "~/img/quick-access-thumbnails/nodejs.webp"
import jiraThumbnail from "~/img/quick-access-thumbnails/jira.webp"
import type { ComponentProps } from "react"
import type { DynamicIcon } from "lucide-react/dynamic"

export enum TechStackCategory {
  Frontend = "frontend",
  Backend = "backend",
  KnownTools = "known-tools",
  // Other = "other" //TODO: consider using this category
}

export const techStackInfo = {
  [TechStackCategory.Frontend]: {
    title: "Frontend",
    description:
      "This is my main area of expertise, as well as the type of work I enjoy the most.",
    thumbnail: reactThumbnail,
    icon: "monitor-smartphone",
    stackGroups: [
      {
        title: "Languages & Markup",
        stack: ["html", "javascript", "typescript"],
      },
      {
        title: "Frameworks & Tooling",
        stack: ["react", "vite", "webpack", "electron"],
      },
      {
        title: "Styling and components",
        stack: ["css", "sass", "tailwindcss", "shadcn", "materialui"],
      },
      {
        title: "Advanced graphics",
        stack: ["svg", "threejs", "opengl+webgl", "glsl"],
      },
      {
        title: "Testing (full stack)",
        stack: ["vitest", "jest", "storybook"],
      },
      {
        title: "Mobile",
        stack: ["react-native", "expo"],
      },
    ],
  },
  [TechStackCategory.Backend]: {
    title: "Backend",
    description:
      "I've learned backend development through work experience and personal projects.\nHere's what I'm most familiar with.",
    thumbnail: nodejsThumbnail,
    icon: "server-cog",
    stackGroups: [
      {
        title: "Languages & Platforms",
        stack: ["python", "java", "cplusplus"],
      },
      {
        title: "Runtimes & Frameworks",
        stack: ["nodejs", "fastify", "express", "puppeteer"],
      },
      {
        title: "Databases",
        stack: ["postgresql", "sqlite", "mongodb"],
      },
      {
        title: "Microcontrollers / Single board computers",
        stack: ["raspberrypi", "micropython"],
      },
    ],
  },
  [TechStackCategory.KnownTools]: {
    title: "Known tools",
    description:
      "Here are some non-coding tools that I have experience using.\nBy the way, I work on Linux.",
    thumbnail: jiraThumbnail,
    icon: "tool-case",
    stackGroups: [
      {
        title: "Graphics and design",
        stack: ["blender", "gimp", "inkscape", "figma"],
      },
      {
        title: "Project management and VCS",
        stack: ["jira", "linear", "git", "github", "gitlab"],
      },
    ],
  },
} as const satisfies {
  [key in TechStackCategory]: {
    title: string
    description: string
    thumbnail: string
    icon: ComponentProps<typeof DynamicIcon>["name"] | { svgPath: string }
    stackGroups: Array<{
      title?: string
      stack: Array<keyof typeof techStack>
    }>
  }
}

export const techStack = {
  html: {
    icon: "devicon-html5-plain colored",
    name: "HTML",
  },
  javascript: {
    icon: "devicon-javascript-plain colored",
    name: "JavaScript",
  },
  typescript: {
    icon: "devicon-typescript-plain colored",
    name: "TypeScript",
  },
  react: {
    icon: "devicon-react-original colored",
    name: "React",
  },
  vite: {
    icon: "devicon-vitejs-plain colored",
    name: "Vite",
  },
  css: {
    icon: "devicon-css3-plain-wordmark colored",
    name: "CSS",
  },
  sass: {
    icon: "devicon-sass-original colored",
    name: "Sass",
  },
  tailwindcss: {
    icon: "devicon-tailwindcss-original colored",
    name: "Tailwind",
  },
  shadcn: {
    icon: "",
    name: "shadcn",
  },
  materialui: {
    icon: "devicon-materialui-plain colored",
    name: "Material UI",
  },
  webpack: {
    icon: "devicon-webpack-plain colored",
    name: "Webpack",
  },
  express: {
    icon: "devicon-express-original",
    name: "Express",
  },
  fastify: {
    icon: "devicon-fastify-plain",
    name: "Fastify",
  },
  "react-native": {
    icon: "devicon-react-original colored",
    name: "React Native",
  },
  expo: {
    icon: "devicon-expo-original",
    name: "Expo + EAS",
  },
  mysql: {
    icon: "devicon-mysql-plain colored",
    name: "MySQL",
  },
  postgresql: {
    icon: "devicon-postgresql-plain colored",
    name: "PostgreSQL",
  },
  sqlite: {
    icon: "devicon-sqlite-plain colored",
    name: "SQLite",
  },
  discordjs: {
    icon: "devicon-discordjs-plain",
    name: "Discord.js",
  },
  nodejs: {
    icon: "devicon-nodejs-plain colored",
    name: "Node.js",
  },
  electron: {
    icon: "devicon-electron-original",
    name: "Electron",
  },
  puppeteer: {
    icon: "devicon-puppeteer-plain colored",
    name: "Puppeteer",
  },
  mongodb: {
    icon: "devicon-mongodb-plain colored",
    name: "MongoDB",
  },
  java: {
    icon: "devicon-java-plain colored",
    name: "Java",
  },
  opengl: {
    icon: "devicon-opengl-plain colored",
    name: "OpenGL",
  },
  blender: {
    icon: "devicon-blender-original colored",
    name: "Blender",
  },
  gimp: {
    icon: "devicon-gimp-plain colored",
    name: "GIMP",
  },
  inkscape: {
    icon: "devicon-inkscape-plain",
    name: "Inkscape",
  },
  raspberrypi: {
    icon: "devicon-raspberrypi-plain colored",
    name: "Raspberry Pi",
  },
  python: {
    icon: "devicon-python-plain colored",
    name: "Python",
  },
  micropython: {
    icon: "devicon-python-plain",
    name: "MicroPython",
  },
  cplusplus: {
    icon: "devicon-cplusplus-plain colored",
    name: "C++",
  },
  threejs: {
    icon: "devicon-threejs-original",
    name: "Three.js",
  },
  "opengl+webgl": {
    icon: "devicon-opengl-plain colored",
    name: "OpenGL + WebGL",
  },
  glsl: {
    icon: "",
    name: "GLSL",
  },
  svg: {
    icon: "",
    name: "SVG",
  },
  figma: {
    icon: "devicon-figma-plain colored",
    name: "Figma",
  },
  jira: {
    icon: "devicon-jira-plain colored",
    name: "Jira",
  },
  linear: {
    icon: "",
    name: "Linear",
  },
  jest: {
    icon: "devicon-jest-plain colored",
    name: "Jest",
  },
  vitest: {
    icon: "devicon-vitest-plain colored",
    name: "Vitest",
  },
  storybook: {
    icon: "devicon-storybook-plain colored",
    name: "Storybook",
  },
  git: {
    icon: "devicon-git-plain colored",
    name: "Git",
  },
  github: {
    icon: "devicon-github-plain",
    name: "GitHub",
  },
  gitlab: {
    icon: "devicon-gitlab-plain colored",
    name: "GitLab",
  },
} as const satisfies Record<
  string,
  {
    icon: string
    name: string
  }
>
