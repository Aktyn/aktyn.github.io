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
    icon: "devicon-nodejs-plain colored",
    name: "Node.js",
  },
  electron: {
    icon: "devicon-electron-original",
    name: "Electron",
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
  raspberrypi: {
    icon: "devicon-raspberrypi-plain colored",
    name: "Raspberry Pi",
  },
  python: {
    icon: "devicon-python-plain colored",
    name: "Python",
  },
  cplusplus: {
    icon: "devicon-cplusplus-plain colored",
    name: "C++",
  },
} as const satisfies Record<
  string,
  {
    icon: string
    name: string
  }
>
