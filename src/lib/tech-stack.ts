export const techStack = {
  typescript: {
    icon: "devicon-typescript-plain colored",
    name: "TypeScript",
  },
  react: {
    icon: "devicon-react-original colored",
    name: "React",
  },
  sass: {
    icon: "devicon-sass-original colored",
    name: "Sass",
  },
  webpack: {
    icon: "devicon-webpack-plain colored",
    name: "Webpack",
  },
  express: {
    icon: "devicon-express-original",
    name: "Express",
  },
  mysql: {
    icon: "devicon-mysql-plain colored",
    name: "MySQL",
  },
  discordjs: {
    icon: "devicon-discordjs-plain",
    name: "Discord.js",
  },
  nodejs: {
    icon: "devicon-nodejs-plain",
    name: "Node.js",
  },
  electron: {
    icon: "devicon-electron-original",
    name: "Electron",
  },
} as const satisfies Record<
  string,
  {
    icon: string
    name: string
  }
>
